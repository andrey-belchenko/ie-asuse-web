CREATE OR REPLACE FUNCTION report_util.get_rep_24557(
        p_дата date,
        p_отделение_id integer [],
        p_участок_id integer []
    ) RETURNS TABLE (
        договор_id int4,
        range_id int4,
        абонент_id int4,
        отделение_id int4,
        участок_id int4,
        гр_потр_нас_id numeric,
        range_name text,
        год int4,
        месяц int4,
        договор_номер varchar,
        абонент_имя varchar,
        отделение_имя varchar,
        участок_имя varchar,
        ику_рсо_имя text,
        гр_потр_нас_имя varchar,
        долг numeric
    ) LANGUAGE plpgsql AS $$ --
    BEGIN
    -- дата записывается в таблицу, для отладки запроса вне функции при необходимости
    create temp table p_date on commit drop as
select p_дата as дата;
-- отделения по по фильтру
create temp table t_otd on commit drop as
select a.отделение_id,
    a.имя
from report_dm.dim_отделение a
where (
        p_отделение_id IS NULL
        OR a.отделение_id = ANY(p_отделение_id)
    );
-- участки по по фильтру
create temp table t_uch on commit drop as
select a.участок_id,
    a.имя
from report_dm.dim_участок a
where (
        p_участок_id IS NULL
        OR a.участок_id = ANY(p_участок_id)
    );
-- договоры
create temp table t_dog on commit drop as
select d.договор_id,
    a.абонент_id,
    o.отделение_id,
    u.участок_id,
    g.гр_потр_нас_id,
    d.номер договор_номер,
    a.имя абонент_имя,
    o.имя отделение_имя,
    u.имя участок_имя,
    g.ику_рсо_имя ику_рсо_имя,
    g.имя гр_потр_нас_имя
from report_dm.dim_договор d
    join t_otd o on o.отделение_id = d.отделение_id
    join t_uch u on u.участок_id = d.участок_id
    join report_dm.dim_гр_потр_нас g on g.гр_потр_нас_id = d.гр_потр_нас_id
    left join report_dm.dim_абонент a on a.абонент_id = d.абонент_id
where g.ику_рсо_id in (1, 2);
-- задолженность по выбранным договорам
create temp table t_msr on commit drop as
select d.договор_id,
    n.дата_возник,
    sum(a.долг_деб_просроч) долг
from report_dm.msr_фин_сальдо_по_док_нач a
    join t_dog d on a.договор_id = d.договор_id
    left join report_dm.dim_док_нач n on n.док_нач_id = a.док_нач_id
where a.вид_реал_id = 2
    and (
        select дата
        from p_date
    ) between a.акт_с and a.акт_по
group by d.договор_id,
    n.дата_возник
having sum(a.долг_деб_просроч) <> 0;
-- построение сетки все договоры с задолженностью х все месяцы
create temp table t_dim on commit drop as with d as (
    select distinct a.договор_id
    from t_msr a
),
dp as (
    select (date_trunc('year', дата) - interval '3 years')::date point0,
        (date_trunc('year', дата) - interval '2 years')::date point1,
        (date_trunc('year', дата) - interval '1 years')::date point2,
        date_trunc('year', дата)::date point3
    from p_date
),
dr as (
    select max(дата_возник) max_date,
        least(
            min(дата_возник),
            (
                select point0
                from dp
            ) - interval '1 day'
        ) min_date
    from t_msr
),
dt1 as (
    select max(дата) дата_возник
    from report_dm.dim_дата dt
        join dr on dt.дата between dr.min_date and dr.max_date
    group by dt.год,
        dt.месяц
),
dt as (
    select dt.дата_возник,
        case
            when dt.дата_возник < dp.point0 then -4
            when dt.дата_возник < dp.point1 then -3
            when dt.дата_возник < dp.point2 then -2
            when dt.дата_возник < dp.point3 then -1
            else 0
        end as range_id
    from dt1 dt
        cross join dp
)
select d.договор_id,
    dt.дата_возник,
    dt.range_id
from d
    cross join dt;
-- итоговый запрос
RETURN QUERY with x as (
    select d.договор_id,
        case
            when d.range_id = -4 then null
            else d.дата_возник
        end as дата_возник,
        d.range_id,
        coalesce(m.долг, 0) долг
    from t_dim d
        left join t_msr m on d.договор_id = m.договор_id
        and d.дата_возник = m.дата_возник
),
x1 as (
    select a.договор_id,
        a.дата_возник,
        a.range_id,
        sum(a.долг) долг
    from x a
    group by a.договор_id,
        a.range_id,
        a.дата_возник
),
x2 as (
    select a.договор_id,
        a.range_id,
        d.абонент_id,
        d.отделение_id,
        d.участок_id,
        d.гр_потр_нас_id,
        case
            a.range_id
            when -4 then 'Просроченная задолженность свыше 3-х лет'
            when -3 then 'Просроченная задолженность -3 года'
            when -2 then 'Просроченная задолженность позапрошлого года'
            when -1 then 'Просроченная задолженность прошлого года'
            when 0 then 'Просроченная задолженность текущего года'
        end range_name,
        dt.год,
        dt.месяц,
        d.договор_номер,
        d.абонент_имя,
        d.отделение_имя,
        d.участок_имя,
        d.ику_рсо_имя,
        d.гр_потр_нас_имя,
        a.долг
    from x1 a
        left join t_dog d on d.договор_id = a.договор_id
        left join report_dm.dim_дата dt on dt.дата = a.дата_возник
)
select *
from x2;
END;
$$;