CREATE OR REPLACE PROCEDURE report_dm.fill_msr_фин_опл_кредит () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_dm.msr_фин_опл_кредит a USING report_stg.refresh_slice rs
WHERE rs.договор_id = a.договор_id
    AND a.дата BETWEEN rs.дата_c AND rs.дата_по;
INSERT INTO report_dm.msr_фин_опл_кредит (
        refresh_slice_id,
        опл_id,
        договор_id,
        вид_реал_id,
        дата,
        опл_кред_перепл,
        опл_кред_аванс,
        сторно_кред_перепл,
        обор_кред,
        опл_кред,
        сторно_кред
    ) with x1 as (
        select rs.refresh_slice_id,
            a.договор_id,
            2 вид_реал_id,
            a.дата,
            a.опл_id,
            a.тип_опл_id,
            a.опл
        from report_stg.фин_опл a
            JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
            AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        where a.тип_опл_id in (1, 2, 5, 6)
    ),
    x2 as (
        select a.*,
            case
                when тип_опл_id in (1) then опл
            end as опл_кред_перепл,
            case
                when тип_опл_id in (2) then опл
            end as опл_кред_аванс,
            case
                when тип_опл_id in (5) then - опл
            end as сторно_кред_перепл,
            case
                when тип_опл_id in (6) then - опл
            end as сторно_кред_аванс
        from x1 a
    ),
    x3 as (
        select a.*,
            coalesce(a.опл_кред_перепл, 0) + coalesce(a.опл_кред_аванс, 0) опл_кред,
            coalesce(a.сторно_кред_перепл, 0) + coalesce(a.сторно_кред_аванс, 0) сторно_кред
        from x2 a
    ),
    x4 as (
        select a.*,
            coalesce(a.опл_кред, 0) - coalesce(a.сторно_кред, 0) обор_кред
        from x3 a
    )
select max(refresh_slice_id) refresh_slice_id,
    опл_id,
    договор_id,
    вид_реал_id,
    дата,
    sum(опл_кред_перепл) опл_кред_перепл,
    sum(опл_кред_аванс) опл_кред_аванс,
    sum(сторно_кред_перепл) сторно_кред_перепл,
    sum(обор_кред) обор_кред,
    sum(опл_кред) опл_кред,
    sum(сторно_кред) сторно_кред
from x4
group by опл_id,
    договор_id,
    вид_реал_id,
    дата;
commit;
END;
$$;