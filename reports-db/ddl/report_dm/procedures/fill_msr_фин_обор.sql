CREATE OR REPLACE PROCEDURE report_dm.fill_msr_фин_обор () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_dm.msr_фин_обор a USING report_stg.refresh_slice rs
WHERE rs.договор_id = a.договор_id
    AND a.дата BETWEEN rs.дата_c AND rs.дата_по;
commit;
INSERT INTO report_dm.msr_фин_обор (
        refresh_slice_id,
        effect_date,
        договор_id,
        вид_реал_id,
        док_нач_id,
        дата,
        обор_деб,
        обор_кред,
        обор_деб_просроч
    ) with x1 as (
        select rs.refresh_slice_id,
            a.дата effect_date,
            a.договор_id,
            a.вид_реал_id,
            a.док_нач_id,
            a.дата,
            a.начисл,
            null::numeric погаш,
            null::numeric обор_кред,
            null::numeric обор_деб_просроч
        from report_dm.msr_фин_начисл a
            JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
            AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        union all
        select rs.refresh_slice_id,
            a.дата effect_date,
            a.договор_id,
            a.вид_реал_id,
            a.док_нач_id,
            a.дата,
            null начисл,
            a.погаш,
            null обор_кред,
            null обор_деб_просроч
        from report_dm.msr_фин_опл_погаш a
            JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
            AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        union all
        select rs.refresh_slice_id,
            a.дата effect_date,
            a.договор_id,
            a.вид_реал_id,
            null док_нач_id,
            a.дата,
            null начисл,
            null погаш,
            a.обор_кред,
            null обор_деб_просроч
        from report_dm.msr_фин_опл_кредит a
            JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
            AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        union all
        select rs.refresh_slice_id,
            a.effect_date,
            a.договор_id,
            a.вид_реал_id,
            a.док_нач_id,
            a.дата,
            null начисл,
            null погаш,
            null обор_кред,
            обор обор_деб_просроч
        from report_dm.msr_фин_обор_просроч a
            JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
            AND a.дата BETWEEN rs.дата_c AND rs.дата_по
    )
select max(a.refresh_slice_id) refresh_slice_id,
    a.effect_date,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    a.дата,
    coalesce(sum(a.начисл), 0) - coalesce(sum(a.погаш), 0) обор_деб,
    sum(a.обор_кред) обор_кред,
    sum(a.обор_деб_просроч) обор_деб_просроч
from x1 a
group by a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    a.дата,
    a.effect_date;
commit;
END;
$$;