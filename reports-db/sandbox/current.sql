--drop table if exists t_отд;
CREATE TEMP TABLE t_otd ON COMMIT drop as
select отделение_id,
    имя
from report_dm.dim_отделение
where отделение_id = 1172;
CREATE TEMP TABLE t_uch ON COMMIT drop as
select участок_id,
    имя
from report_dm.dim_участок;
CREATE TEMP TABLE t_dog ON COMMIT drop as
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
CREATE TEMP TABLE t_rep1 ON COMMIT drop as
select d.договор_id,
    dv.год,
    dv.месяц,
    max(d.абонент_id) абонент_id,
    max(d.отделение_id) отделение_id,
    max(d.участок_id) участок_id,
    max(d.гр_потр_нас_id) гр_потр_нас_id,
    max(d.договор_номер) договор_номер,
    sum(a.долг_деб_просроч) долг_деб_просроч,
    max(d.абонент_имя) абонент_имя,
    max(d.отделение_имя) отделение_имя,
    max(d.участок_имя) участок_имя,
    max(d.ику_рсо_имя) ику_рсо_имя,
    max(d.гр_потр_нас_имя) гр_потр_нас_имя
from report_dm.msr_фин_сальдо_по_док_нач a
    join t_dog d on a.договор_id = d.договор_id
    left join report_dm.dim_док_нач n on n.док_нач_id = a.док_нач_id
    left join report_dm.dim_дата dv on dv.дата = n.дата_возник
where a.вид_реал_id = 2
    and '2022-03-31' between a.акт_с and a.акт_по
group by d.договор_id,
    dv.год,
    dv.месяц
having sum(a.долг_деб_просроч) <> 0
order by договор_номер;
--select * from t_rep1
select sum(долг_деб_просроч)
from t_rep1
where год = 2021
    and месяц = 6 --select  
    --sum(долг_деб_просроч)
    --from t_rep1 a;
    --select  
    --a.*,
    --n.дата_возник
    --from t_rep1 a
    --left join report_dm.dim_док_нач n on n.док_нач_id = a.док_нач_id  
    --select  
    --a.*,
    --n.kod_sf
    --from t_rep1 a
    --left join sr_facvip n on n.kod_sf = a.док_нач_id  
    --select * from report_dm.msr_фин_сальдо_по_док_нач a where док_нач_id is null