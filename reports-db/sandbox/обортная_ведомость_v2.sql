-- drop table if exists report_dev.test1;

create table report_dev.test1 as with p as (
    select '2021-03-01'::date дата_с,
        '2021-03-31'::date дата_по
),
p_отд as (
    select *
    from report_dm.dim_отделение
),
n as (
    select a.договор_id,
        a.начисл,
        a.погаш_оплатой,
        a.погаш_из_кред,
        a.опл_кред_перепл,
        a.опл_кред_аванс
    from report_dm.msr_фин_опер a
        join p on a.дата between p.дата_с and p.дата_по
        left join report_dm.dim_договор d on d.договор_id = a.договор_id
        join p_отд o on d.отделение_id = o.отделение_id
    where a.вид_реал_id = 2 -- and a.договор_id = 2058
),
sn as (
    select a.договор_id,
        a.долг_деб as долг_деб_нач,
        a.долг_кред as долг_кред_нач
    from report_dm.msr_фин_сальдо_по_дог_вид_реал a
        join p on p.дата_с between a.акт_с and a.акт_по
        left join report_dm.dim_договор d on d.договор_id = a.договор_id
        join p_отд o on d.отделение_id = o.отделение_id
    where a.вид_реал_id = 2 -- and a.договор_id = 2058
),
sk as (
    select a.договор_id,
        a.долг_деб as долг_деб_кон,
        a.долг_кред as долг_кред_кон
    from report_dm.msr_фин_сальдо_по_дог_вид_реал a
        join p on p.дата_по between a.акт_с and a.акт_по
        left join report_dm.dim_договор d on d.договор_id = a.договор_id
        join p_отд o on d.отделение_id = o.отделение_id
    where a.вид_реал_id = 2 -- and a.договор_id = 2058
),
x as (
    select договор_id,
        null::numeric долг_деб_нач,
        null::numeric долг_кред_нач,
        начисл,
        погаш_оплатой,
        погаш_из_кред,
        опл_кред_перепл,
        опл_кред_аванс,
        null::numeric долг_деб_кон,
        null::numeric долг_кред_кон
    from n
    UNION ALL
    select договор_id,
        долг_деб_нач,
        долг_кред_нач,
        null начисл,
        null погаш_оплатой,
        null погаш_из_кред,
        null опл_кред_перепл,
        null опл_кред_аванс,
        null долг_деб_кон,
        null долг_кред_кон
    from sn
    UNION ALL
    select договор_id,
        null долг_деб_нач,
        null долг_кред_нач,
        null начисл,
        null погаш_оплатой,
        null погаш_из_кред,
        null опл_кред_перепл,
        null опл_кред_аванс,
        долг_деб_кон,
        долг_кред_кон
    from sk
),
x1 as (
    select договор_id,
        sum(долг_деб_нач) долг_деб_нач,
        sum(долг_кред_нач) долг_кред_нач,
        sum(начисл) начисл,
        sum(погаш_оплатой) погаш_оплатой,
        sum(погаш_из_кред) погаш_из_кред,
        sum(опл_кред_перепл) опл_кред_перепл,
        sum(опл_кред_аванс) опл_кред_аванс,
        sum(долг_деб_кон) долг_деб_кон,
        sum(долг_кред_кон) долг_кред_кон
    from x
    group by договор_id
),
x2 as (
    select a.договор_id,
        o.имя отделение_наименование,
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
from x1