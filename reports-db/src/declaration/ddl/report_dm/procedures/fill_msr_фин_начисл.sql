CREATE OR REPLACE PROCEDURE report_dm.fill_msr_фин_начисл () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_dm.msr_фин_начисл a USING report_stg.refresh_slice rs
WHERE rs.договор_id = a.договор_id
    AND a.дата BETWEEN rs.дата_c AND rs.дата_по;
INSERT INTO report_dm.msr_фин_начисл (
        refresh_slice_id,
        договор_id,
        вид_реал_id,
        дата,
        док_нач_id,
        вид_тов_id,
        начисл
    )
select 
    rs.refresh_slice_id,
    a.договор_id,
    a.вид_реал_id,
    a.дата,
    a.док_нач_id,
    a.вид_тов_id,
    a.начисл
from report_stg.фин_начисл a
    JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
    AND a.дата BETWEEN rs.дата_c AND rs.дата_по;
commit;
END;
$$;