CREATE OR REPLACE FUNCTION report_stg.get_last_date_of_ym(p_ym NUMERIC) RETURNS DATE AS $$ BEGIN -- chat gpt
    RETURN (
        DATE_TRUNC(
            'MONTH',
            MAKE_DATE(
                CAST(FLOOR(p_ym) AS INTEGER),
                CAST(ROUND((p_ym - FLOOR(p_ym)) * 100) AS INTEGER),
                1
            )
        ) + INTERVAL '1 MONTH' - INTERVAL '1 DAY'
    )::DATE;
END;
$$ LANGUAGE plpgsql;