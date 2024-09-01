CREATE OR REPLACE VIEW report_dm.dim_вид_тов AS
select vid_t as вид_тов_id,
    name as имя,
    num_t номер
from sk_nachisl;