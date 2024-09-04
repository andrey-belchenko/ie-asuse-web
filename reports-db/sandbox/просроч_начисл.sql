drop table if exists temp1;
CREATE TEMP TABLE temp1 --ON COMMIT DROP 
AS with x1 as (
    select rs.refresh_slice_id,
        a.дата,
        a.договор_id,
        a.вид_реал_id,
        a.док_нач_id,
        a.начисл,
        coalesce(fv.dat_zadol, d.dat_bzad, a.дата) dat_bzad,
        fv.dat_ezad
    from report_stg.фин_начисл a
        JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
        AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        left join sr_facvip fv on fv.kod_sf = a.док_нач_id
        left join sr_debet d on d.kod_deb = fv.kod_deb
    where a.договор_id in (2000300688, 358)
)
select max(a.refresh_slice_id) refresh_slice_id,
    a.дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    sum(a.начисл) начисл,
    max(a.dat_bzad) dat_bzad,
    max(a.dat_ezad) dat_ezad
from x1 a
GROUP BY a.док_нач_id,a.договор_id,a.вид_реал_id,a.дата;

create table report_dev.msr_фин_обор_просроч as

with x2 as (
select a.refresh_slice_id,
    a.дата effect_date,
    a.dat_bzad дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    a.начисл,
    null::numeric отмена_начисл
from temp1 a

union all

select a.refresh_slice_id,
    a.дата effect_date,
    a.dat_ezad дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    null начисл,
    -a.начисл отмена_начисл
from temp1 a where a.dat_ezad is not null

)

--select * from  x2 a

select 
 	max(a.refresh_slice_id) refresh_slice_id,
    a.effect_date,
    a.дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    sum(a.начисл) начисл,
    sum(a.отмена_начисл) отмена_начисл
from x2 a

group by 

 a.док_нач_id,a.договор_id,a.вид_реал_id,a.дата, a.effect_date
;
--effect_date