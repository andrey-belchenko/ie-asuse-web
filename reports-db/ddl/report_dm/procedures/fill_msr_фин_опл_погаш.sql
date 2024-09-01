CREATE OR REPLACE PROCEDURE report_dm.fill_msr_фин_опл_погаш () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_dm.msr_фин_опл_погаш a USING report_stg.refresh_slice rs
WHERE rs.договор_id = a.договор_id
    AND a.дата BETWEEN rs.дата_c AND rs.дата_по;
INSERT INTO report_dm.msr_фин_опл_погаш (
        refresh_slice_id,
        опл_id,
        договор_id,
        вид_реал_id,
        дата,
        док_нач_id,
        погаш_оплатой_без_аванса,
        погаш_оплатой_аванс,
        погаш_из_перепл,
        погаш_из_аванса,
        погаш_оплатой,
        погаш_из_кред,
        погаш,
        погаш_без_аванса
    ) with x1 as (
        select rs.refresh_slice_id,
            a.договор_id,
            a.вид_реал_id,
            a.дата,
            a.док_нач_id,
            a.опл_id,
            a.тип_опл_id,
            a.опл
        from report_stg.фин_опл a
            JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
            AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        where a.тип_опл_id in (0, 2, 3, 4) -- and договор_id = 358
    ),
    x2 as (
        select a.*,
            case
                when тип_опл_id in (0) then опл
            end as погаш_оплатой_без_аванса,
            case
                when тип_опл_id in (2) then опл
            end as погаш_оплатой_аванс,
            case
                when тип_опл_id in (3) then опл
            end as погаш_из_перепл,
            case
                when тип_опл_id in (4) then опл
            end as погаш_из_аванса
        from x1 a
    ),
    x3 as (
        select a.*,
            coalesce(a.погаш_оплатой_без_аванса, 0) + coalesce(a.погаш_оплатой_аванс, 0) погаш_оплатой,
            coalesce(a.погаш_из_перепл, 0) + coalesce(a.погаш_из_аванса, 0) погаш_из_кред
        from x2 a
    ),
    x4 as (
        select a.*,
            coalesce(a.погаш_оплатой, 0) + coalesce(a.погаш_из_кред, 0) погаш,
            coalesce(a.погаш_оплатой_без_аванса, 0) + coalesce(a.погаш_из_кред, 0) погаш_без_аванса
        from x3 a
    )
select max(refresh_slice_id) refresh_slice_id,
    опл_id,
    договор_id,
    вид_реал_id,
    дата,
    док_нач_id,
    sum(погаш_оплатой_без_аванса) погаш_оплатой_без_аванса,
    sum(погаш_оплатой_аванс) погаш_оплатой_аванс,
    sum(погаш_из_перепл) погаш_из_перепл,
    sum(погаш_из_аванса) погаш_из_аванса,
    sum(погаш_оплатой) погаш_оплатой,
    sum(погаш_из_кред) погаш_из_кред,
    sum(погаш) погаш,
    sum(погаш_без_аванса) погаш_без_аванса
from x4
group by опл_id,
    договор_id,
    вид_реал_id,
    дата,
    док_нач_id;
commit;
END;
$$;