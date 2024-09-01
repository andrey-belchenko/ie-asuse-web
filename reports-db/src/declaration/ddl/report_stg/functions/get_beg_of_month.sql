CREATE OR REPLACE FUNCTION report_stg.get_beg_of_month(val DATE) RETURNS DATE AS $$ BEGIN
    RETURN date_trunc('MONTH', val)::DATE;
END;
$$ LANGUAGE plpgsql;