CREATE OR REPLACE FUNCTION report_stg.get_last_date_of_ym(p_ym NUMERIC) 
RETURNS DATE AS $$
-- chat gpt
    SELECT (
        DATE_TRUNC(
            'MONTH',
            MAKE_DATE(
                CAST(FLOOR($1) AS INTEGER),
                CAST(ROUND(($1 - FLOOR($1)) * 100) AS INTEGER),
                1
            )
        ) + INTERVAL '1 MONTH' - INTERVAL '1 DAY'
    )::DATE;
$$ LANGUAGE SQL IMMUTABLE COST 100;