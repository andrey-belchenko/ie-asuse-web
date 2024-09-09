CREATE OR REPLACE VIEW report_dm.dim_участок AS
select o.kodp участок_id,
    o.name имя,
    o.sname сокр_имя
from kr_org o
where exists (
        select *
        from kr_dogovor d
        where d.kodp_uch = o.kodp
    );