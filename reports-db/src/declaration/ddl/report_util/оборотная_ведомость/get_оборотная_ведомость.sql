CREATE OR REPLACE FUNCTION report_util.get_оборотная_ведомость(
        p_дата_с date,
        p_дата_по date,
        p_отделение_id integer []
    ) RETURNS TABLE (
        договор_id int4 ,
	отделение_наименование varchar ,
	договор_номер varchar ,
	долг_деб_нач numeric ,
	долг_кред_нач numeric ,
	начисл numeric ,
	погаш_оплатой numeric ,
	погаш_из_кред numeric ,
	опл_кред_перепл numeric ,
	опл_кред_аванс numeric ,
	долг_деб_кон numeric ,
	долг_кред_кон numeric 
    ) LANGUAGE plpgsql AS $$ BEGIN 
    
    
    RETURN QUERY 
    with p as (
        select p_дата_с дата_с,
            p_дата_по дата_по
    ),
    -- тут может быть фильтр по отделению
    p_отд as (
        select *
        from report_dm.dim_отделение a
        where a.отделение_id in (
                SELECT unnest(p_отделение_id)
            )
    ),
    -- 1. СБОР ФАКТОВ ИЗ РАЗНЫХ ТАБЛИЦ И ФИЛЬТРАЦИЯ
    -- 1.1 факты по начислениям
    n as (
        select a.договор_id,
            a.начисл
        from report_dm.msr_фин_начисл a -- ФИЛЬТРАЦИЯ (одинаковая для всех фактов по ОБОРОТАМ)
            join p on a.дата between p.дата_с and p.дата_по
            left join report_dm.dim_договор d on d.договор_id = a.договор_id
            join p_отд o on d.отделение_id = o.отделение_id
        where a.вид_реал_id = 2
    ),
    -- 1.2 факты по оплате счетов
    op as (
        select a.договор_id,
            a.погаш_оплатой,
            a.погаш_из_кред
        from report_dm.msr_фин_опл_погаш a -- ФИЛЬТРАЦИЯ (одинаковая для всех фактов по ОБОРОТАМ)
            join p on a.дата between p.дата_с and p.дата_по
            left join report_dm.dim_договор d on d.договор_id = a.договор_id
            join p_отд o on d.отделение_id = o.отделение_id
        where a.вид_реал_id = 2
    ),
    -- 1.3 факты обороты по кредиту
    ok as (
        select a.договор_id,
            a.опл_кред_перепл,
            a.опл_кред_аванс
        from report_dm.msr_фин_опл_кредит a -- ФИЛЬТРАЦИЯ (одинаковая для всех фактов по ОБОРОТАМ)
            join p on a.дата between p.дата_с and p.дата_по
            left join report_dm.dim_договор d on d.договор_id = a.договор_id
            join p_отд o on d.отделение_id = o.отделение_id
        where a.вид_реал_id = 2
    ),
    -- 1.4 факты сальдо на начало
    sn as (
        select a.договор_id,
            a.долг_деб as долг_деб_нач,
            a.долг_кред as долг_кред_нач
        from report_dm.msr_фин_сальдо_по_дог_вид_реал a -- ФИЛЬТРАЦИЯ (отличается фильтр по дате - на начало)
            join p on p.дата_с between a.акт_с and a.акт_по
            left join report_dm.dim_договор d on d.договор_id = a.договор_id
            join p_отд o on d.отделение_id = o.отделение_id
        where a.вид_реал_id = 2
    ),
    -- 1.5 факты сальдо на конец
    sk as (
        select a.договор_id,
            a.долг_деб as долг_деб_кон,
            a.долг_кред as долг_кред_кон
        from report_dm.msr_фин_сальдо_по_дог_вид_реал a -- ФИЛЬТРАЦИЯ (отличается фильтр по дате - на конец)
            join p on p.дата_по between a.акт_с and a.акт_по
            left join report_dm.dim_договор d on d.договор_id = a.договор_id
            join p_отд o on d.отделение_id = o.отделение_id
        where a.вид_реал_id = 2
    ),
    -- 2. ОБЪЕДИНЕНИЕ ВСЕХ СОБРАННЫХ ФАКТОВ В ОБЩУЮ ТАБЛИЦУ
    x as (
        select a.договор_id,
            null::numeric долг_деб_нач,
            null::numeric долг_кред_нач,
            a.начисл,
            null::numeric погаш_оплатой,
            null::numeric погаш_из_кред,
            null::numeric опл_кред_перепл,
            null::numeric опл_кред_аванс,
            null::numeric долг_деб_кон,
            null::numeric долг_кред_кон
        from n a
        UNION ALL
        select a.договор_id,
            null долг_деб_нач,
            null долг_кред_нач,
            null начисл,
            a.погаш_оплатой,
            a.погаш_из_кред,
            null опл_кред_перепл,
            null опл_кред_аванс,
            null долг_деб_кон,
            null долг_кред_кон
        from op a
        UNION ALL
        select a.договор_id,
            null долг_деб_нач,
            null долг_кред_нач,
            null начисл,
            null погаш_оплатой,
            null погаш_из_кред,
            a.опл_кред_перепл,
            a.опл_кред_аванс,
            null долг_деб_кон,
            null долг_кред_кон
        from ok a
        UNION ALL
        select a.договор_id,
            a.долг_деб_нач,
            a.долг_кред_нач,
            null начисл,
            null погаш_оплатой,
            null погаш_из_кред,
            null опл_кред_перепл,
            null опл_кред_аванс,
            null долг_деб_кон,
            null долг_кред_кон
        from sn a
        UNION ALL
        select a.договор_id,
            null долг_деб_нач,
            null долг_кред_нач,
            null начисл,
            null погаш_оплатой,
            null погаш_из_кред,
            null опл_кред_перепл,
            null опл_кред_аванс,
            a.долг_деб_кон,
            a.долг_кред_кон
        from sk a
    ),
    -- 3. ГРУППИРОВКА И ВЫРАЖЕНИЯ С АРИФМЕТИЧЕСКИМИ ОПЕРАЦИЯМИ ПРИ НЕОБХОДИМОСТИ
    x1 as (
        select a.договор_id,
            sum(a.долг_деб_нач) долг_деб_нач,
            sum(a.долг_кред_нач) долг_кред_нач,
            sum(a.начисл) начисл,
            sum(a.погаш_оплатой) погаш_оплатой,
            sum(a.погаш_из_кред) погаш_из_кред,
            sum(a.опл_кред_перепл) опл_кред_перепл,
            sum(a.опл_кред_аванс) опл_кред_аванс,
            sum(a.долг_деб_кон) долг_деб_кон,
            sum(a.долг_кред_кон) долг_кред_кон
        from x a
        group by a.договор_id
    ),
    -- 4. ДОБАВЛЕНИЕ АТРИБУТОВ ИЗ ИЗМЕРЕНИЙ
    x2 as (
        select a.договор_id,
            o.наименование отделение_наименование,
            d.номер договор_номер,
            a.долг_деб_нач,
            a.долг_кред_нач,
            a.начисл,
            a.погаш_оплатой,
            a.погаш_из_кред,
            a.опл_кред_перепл,
            a.опл_кред_аванс,
            a.долг_деб_кон,
            a.долг_кред_кон
        from x1 a
            left join report_dm.dim_договор d on d.договор_id = a.договор_id
            left join report_dm.dim_отделение o on d.отделение_id = o.отделение_id
    )
select *
from x2;
END;
$$;