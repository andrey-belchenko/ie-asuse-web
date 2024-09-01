CREATE OR REPLACE VIEW report_dm.dim_договор AS
select kod_dog договор_id,
    dep отделение_id,
    ndog номер
from kr_dogovor;