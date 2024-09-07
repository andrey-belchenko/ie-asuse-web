CREATE OR REPLACE FUNCTION report_stg.latest(VARIADIC dates date[])
RETURNS date AS $$
DECLARE
    max_date date = '1970-01-01';
    date_value date;
    all_nulls boolean = true;
BEGIN
    FOREACH date_value IN ARRAY dates LOOP
        IF date_value IS NOT NULL THEN
            all_nulls = false;
            IF date_value > max_date THEN
                max_date = date_value;
            END IF;
        END IF;
    END LOOP;
    IF all_nulls THEN
        RETURN NULL;
    ELSE
        RETURN max_date;
    END IF;
END;
$$ LANGUAGE plpgsql;