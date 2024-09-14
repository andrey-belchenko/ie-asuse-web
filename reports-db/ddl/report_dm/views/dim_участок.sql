CREATE OR REPLACE VIEW report_dm.dim_участок AS
select o.kodp участок_id,
    d.dep отделение_id,
    o.name имя,
    o.sname сокр_имя
from kr_dogovor d
    join kr_org o on o.kodp = d.kodp_uch
where d.kodp_uch = o.kodp
group by o.kodp,
    d.dep,
    o.name,
    o.sname