CREATE OR REPLACE VIEW report_dm.dim_вид_реал AS
select
vid_real вид_реал_id,
name имя
from sk_vid_real a