CREATE OR REPLACE FUNCTION report_stg.get_month_name(month_number integer)
RETURNS text AS $$
    SELECT CASE
        WHEN month_number = 1 THEN 'Январь'
        WHEN month_number = 2 THEN 'Февраль'
        WHEN month_number = 3 THEN 'Март'
        WHEN month_number = 4 THEN 'Апрель'
        WHEN month_number = 5 THEN 'Май'
        WHEN month_number = 6 THEN 'Июнь'
        WHEN month_number = 7 THEN 'Июль'
        WHEN month_number = 8 THEN 'Август'
        WHEN month_number = 9 THEN 'Сентябрь'
        WHEN month_number = 10 THEN 'Октябрь'
        WHEN month_number = 11 THEN 'Ноябрь'
        WHEN month_number = 12 THEN 'Декабрь'
    END;
$$ LANGUAGE sql IMMUTABLE;