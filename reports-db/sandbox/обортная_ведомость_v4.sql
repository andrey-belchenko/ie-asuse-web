-- drop table if exists report_dev.test1;
create table report_dev.test1 as 
with p as (
    select '2021-03-01'::date дата_с,
        '2021-03-31'::date дата_по
)
select a.договор_id,
sum(a.начисл) начисл,
sum(a.погаш_оплатой) погаш_оплатой,
sum(a.погаш_из_кред) погаш_из_кред,
sum(a.опл_кред_перепл) опл_кред_перепл,
sum(a.опл_кред_аванс) опл_кред_аванс,
sum(
    case
        when p.дата_с between a.акт_с and a.акт_по then a.долг_деб
    end
) долг_деб_нач,
sum(
    case
        when p.дата_с between акт_с and акт_по then долг_кред
    end
) долг_кред_нач,
sum(
    case
        when p.дата_по between a.акт_с and a.акт_по then a.долг_деб
    end
) долг_деб_кон,
sum(
    case
        when p.дата_по between акт_с and акт_по then долг_кред
    end
) долг_кред_кон
from report_dm.msr_фин a
    cross join p
where a.вид_реал_id = 2 
and a.акт_с <=  '2021-03-31'::date
    and a.акт_по >= '2021-03-01'::date
group by a.договор_id