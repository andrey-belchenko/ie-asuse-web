CREATE OR REPLACE VIEW report_dm.dim_договор AS --
with gr_potr_nas as (
select a.objid as kod_dog,
    max(a.kod_refcode) as kod_refcode
from report_src.rr_refprop a
    left outer join report_src.rs_refcode kod_refcode on a.kod_refcode = kod_refcode.kod_refcode
where kod_refcode.kod_refbook = 103
    and a.kod_refobject = 2
group by a.objid
)
select a.kod_dog договор_id,
    a.dep отделение_id,
    a.ndog номер,
    gpn.kod_refcode as гр_потр_нас_id
from kr_dogovor a
    left join gr_potr_nas gpn on gpn.kod_dog = a.kod_dog;