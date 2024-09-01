CREATE OR REPLACE FUNCTION report_stg.get_end_of_month(val DATE) RETURNS DATE AS $$ BEGIN
    RETURN  (date_trunc('MONTH', current_date) + INTERVAL '1 MONTH' - INTERVAL '1 day')::date;
END;
$$ LANGUAGE plpgsql;