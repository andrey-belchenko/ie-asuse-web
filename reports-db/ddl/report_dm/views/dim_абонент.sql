CREATE OR REPLACE VIEW report_dm.dim_абонент AS
select a.kodp абонент_id,
    a.nump код,
    a.name имя
from kr_payer a