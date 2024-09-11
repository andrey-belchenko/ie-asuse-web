CREATE OR REPLACE PROCEDURE report_dm.fill_dim_дата () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_dm.dim_дата;
INSERT INTO report_dm.dim_дата (
        дата,
        год,
        месяц,
        месяц_имя
    ) with x1 as (
        SELECT дата::date,
            EXTRACT(
                MONTH
                FROM дата
            )::integer AS месяц,
            EXTRACT(
                YEAR
                FROM дата
            )::integer AS год
        FROM generate_series(
                (CURRENT_DATE - INTERVAL '30 years')::date,
                (CURRENT_DATE + INTERVAL '1 years')::date,
                '1 day'::interval
            ) AS дата
    )
select дата,
    год,
    месяц,
    report_stg.get_month_name(месяц)
from x1;
commit;
END;
$$;