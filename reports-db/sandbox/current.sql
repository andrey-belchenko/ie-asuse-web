drop table if exists nach_temp;
CREATE TEMP TABLE nach_temp --ON COMMIT DROP 
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
GROUP BY a.док_нач_id,
    a.договор_id,
    a.вид_реал_id,
    a.дата;
drop table if exists opl_temp;
CREATE TEMP TABLE opl_temp --ON COMMIT DROP 
as with x1 as (
    select rs.refresh_slice_id,
        a.договор_id,
        a.вид_реал_id,
        a.дата,
        a.док_нач_id,
        a.опл_id,
        a.тип_опл_id,
        a.опл,
        coalesce(
            fv.dat_zadol,
            d.dat_bzad,
            report_stg.get_last_date_of_ym(fv.ym)
        ) dat_bzad,
        fv.dat_ezad
    from report_stg.фин_опл a
        JOIN report_stg.refresh_slice rs ON rs.договор_id = a.договор_id
        AND a.дата BETWEEN rs.дата_c AND rs.дата_по
        left join sr_facvip fv on fv.kod_sf = a.док_нач_id
        left join sr_debet d on d.kod_deb = fv.kod_deb
    where a.тип_опл_id in (0, 2, 3, 4)
        and a.договор_id in (2000300688, 358)
),
x2 as (
    select a.refresh_slice_id,
        a.дата effect_date,
        a.договор_id,
        a.вид_реал_id,
        a.док_нач_id,
        case
            when a.дата < a.dat_bzad then a.dat_bzad
            else a.дата
        end as дата,
        a.dat_ezad,
        a.опл
    from x1 a
)
select max(a.refresh_slice_id) refresh_slice_id,
    a.дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    a.effect_date,
    a.dat_ezad,
    sum(a.опл) опл
from x2 a
GROUP BY a.док_нач_id,
    a.договор_id,
    a.вид_реал_id,
    a.дата,
    a.effect_date,
    a.dat_ezad;
drop table if exists report_dev.msr_фин_обор_просроч;
create table report_dev.msr_фин_обор_просроч as with x2 as (
    select a.refresh_slice_id,
        a.дата effect_date,
        a.dat_bzad дата,
        a.договор_id,
        a.вид_реал_id,
        a.док_нач_id,
        a.начисл,
        null::numeric отмена_начисл,
        null::numeric опл,
        null::numeric отмена_опл
    from nach_temp a
    union all
    select a.refresh_slice_id,
        a.дата effect_date,
        a.dat_ezad дата,
        a.договор_id,
        a.вид_реал_id,
        a.док_нач_id,
        null начисл,
        a.начисл отмена_начисл,
        null опл,
        null отмена_опл
    from nach_temp a
    where a.dat_ezad is not null
    union all
    select a.refresh_slice_id,
        a.effect_date,
        a.дата,
        a.договор_id,
        a.вид_реал_id,
        a.док_нач_id,
        null начисл,
        null отмена_начисл,
        a.опл,
        null отмена_опл
    from opl_temp a
    union all
    select a.refresh_slice_id,
        a.effect_date,
        a.dat_ezad дата,
        a.договор_id,
        a.вид_реал_id,
        a.док_нач_id,
        null начисл,
        null отмена_начисл,
        null опл,
        a.опл отмена_опл
    from opl_temp a
    where a.dat_ezad is not null
) 
select max(a.refresh_slice_id) refresh_slice_id,
    a.effect_date,
    a.дата,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    sum(a.начисл) начисл,
    sum(a.отмена_начисл) отмена_начисл,
    sum(a.опл) опл,
    sum(a.отмена_опл) отмена_опл,
    sum(
        coalesce(a.начисл, 0) - coalesce(a.отмена_начисл, 0) - coalesce(a.опл, 0) + coalesce(a.отмена_опл, 0)
    ) обор
from x2 a
group by a.док_нач_id,
    a.договор_id,
    a.вид_реал_id,
    a.дата,
    a.effect_date;
select *
from report_dev.msr_фин_обор_просроч
order by док_нач_id,
    дата;