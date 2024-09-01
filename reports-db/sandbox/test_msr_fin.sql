select вид_реал_id,
    sum(начисл) начисл
from report_dm.msr_фин a
where a.акт_с between '2021-03-01'::date and '2021-03-31'::date
group by вид_реал_id