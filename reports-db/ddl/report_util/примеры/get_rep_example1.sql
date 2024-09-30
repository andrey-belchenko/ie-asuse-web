CREATE OR REPLACE FUNCTION report_util.get_rep_example1(
        p_дата_c date,
        p_дата_по date
    ) RETURNS TABLE (
        отделение_аббр text,
        год numeric,
        месяц_имя text,
        вид_реал_имя text,
        начисл numeric,
        погаш numeric
    ) LANGUAGE plpgsql AS $$ --
    BEGIN -- 
    RETURN QUERY with x as (
        select a.договор_id,
            a.вид_реал_id,
            a.дата,
            a.начисл,
            null::numeric погаш
        from report_dm.msr_фин_начисл a
        where a.дата between p_дата_c and p_дата_по
        union all
        select a.договор_id,
            a.вид_реал_id,
            a.дата,
            null начисл,
            a.погаш
        from report_dm.msr_фин_опл_погаш a
        where a.дата between p_дата_c and p_дата_по
    )
select o.аббр отделение_аббр,
    dt.год,
    dt.месяц_имя,
    vr.имя вид_реал_имя,
    sum(a.начисл) начисл,
    sum(a.погаш) погаш
from x a
    left join report_dm.dim_договор d on d.договор_id = a.договор_id
    left join report_dm.dim_отделение o on o.отделение_id = d.отделение_id
    left join report_dm.dim_вид_реал vr on vr.вид_реал_id = a.вид_реал_id
    left join report_dm.dim_дата dt on dt.дата = a.дата
group by o.аббр,
    dt.год,
    dt.месяц_имя,
    vr.имя;
END;
$$;