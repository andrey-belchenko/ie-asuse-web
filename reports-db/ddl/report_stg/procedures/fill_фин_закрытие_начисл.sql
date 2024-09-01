CREATE OR REPLACE PROCEDURE report_stg.fill_фин_закрытие_начисл () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_stg.фин_закрытие_начисл;
INSERT INTO report_stg.фин_закрытие_начисл (док_нач_id, дата_закрытия) with n as (
    select fr.kod_sf,
      max(fv.vid_real) vid_real,
      max(fv.dat_ezad) dat_ezad,
      sum (fr.nachisl) nachisl
    from sr_facras fr
      join sr_facvip fv on fr.kod_sf = fv.kod_sf
    where fv.vid_sf NOT IN (2, 9) -- and fv.kod_dog = 358
    group by fr.kod_sf
  ),
  o as (
    select kod_sf,
      max(dat_uch) last_opl_date,
      sum (opl) opl
    from sr_opl
    where kod_type_opl in (0, 2, 3, 4) --AND kod_dog = 358
    group by kod_sf
  ),
  x as (
    select n.kod_sf,
      COALESCE(n.nachisl, 0) - COALESCE(o.opl, 0) as dolg,
      o.last_opl_date,
      n.dat_ezad,
      n.vid_real,
      n.nachisl
    from n
      left join o on n.kod_sf = o.kod_sf
  ),
  x1 as (
    select a.*,
      COALESCE(
        a.dat_ezad,
        case
          WHEN dolg = 0 then last_opl_date
        END
      ) closure_date
    from x a
  )
select kod_sf док_нач_id,
  COALESCE(closure_date, '2100-12-31'::date)::date дата_закрытия
from x1;
commit;
END;
$$;