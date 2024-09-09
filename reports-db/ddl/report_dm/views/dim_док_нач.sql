CREATE OR REPLACE VIEW report_dm.dim_док_нач AS
select a.kod_sf док_нач_id,
    --   a.dat_sf дата_возник
    report_stg.get_last_date_of_ym(a.ym) дата_возник
    -- (
    --     DATE_TRUNC(
    --         'MONTH',
    --         MAKE_DATE(
    --             CAST(FLOOR(a.ym) AS INTEGER),
    --             CAST(ROUND((a.ym - FLOOR(a.ym)) * 100) AS INTEGER),
    --             1
    --         )
    --     ) + INTERVAL '1 MONTH' - INTERVAL '1 DAY'
    -- )::DATE дата_возник
from sr_facvip a