CREATE OR REPLACE FUNCTION report_stg.get_ym_from_date(p_date DATE) RETURNS numeric(6, 2) AS $$
SELECT (
        EXTRACT(
            YEAR
            FROM p_date
        ) + EXTRACT(
            MONTH
            FROM p_date
        ) / 100.0
    )::numeric(6, 2);
$$ LANGUAGE SQL IMMUTABLE;