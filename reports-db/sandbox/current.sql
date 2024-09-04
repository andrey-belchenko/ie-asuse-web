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
        coalesce(fv.dat_ezad, report_stg.max_date()) as dat_ezad
    from report_stg.фин_начисл a
        JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
        AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        left join sr_facvip fv on fv.kod_sf = a.док_нач_id
        left join sr_debet d on d.kod_deb = fv.kod_deb
    where a.договор_id in (2000300688, 358)
)
select max(a.refresh_slice_id) refresh_slice_id,
    a.дата дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    sum(a.начисл) начисл,
    max(a.dat_bzad) dat_bzad,
    max(a.dat_ezad) dat_ezad
from x1 a
GROUP BY a.док_нач_id,a.договор_id,a.вид_реал_id,a.дата;
select a.refresh_slice_id,
    a.дата effect_date,
    a.dat_bzad дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    a.начисл
from temp1 a;
--effect_date