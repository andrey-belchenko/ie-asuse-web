CREATE OR REPLACE PROCEDURE report_stg.fill_фин_закрытие_кред () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_stg.фин_закрытие_кред;
INSERT INTO report_stg.фин_закрытие_кред (опл_id, дата_закрытия) with o as (
    select kod_opl,
      dat_uch,
      opl opl
    from sr_opl a
    where a.kod_type_opl in (1, 2)
      --and a.kod_dog = 358
  ),
  s as (
    select kod_parent as kod_opl,
      dat_uch,
      COALESCE(opl, 0) + COALESCE(opls, 0) as opl
    from sr_opl a
    where a.kod_type_opl in (5, 6)
     -- and a.kod_dog = 358
  ),
  k1 as (
    select *
    from o
    union all
    select *
    from s
  ),
  k2 as (
    select kod_opl,
      sum(opl) as dolg,
      max (dat_uch) as dat_uch
    from k1 a
    GROUP BY kod_opl
  ),
  k3 as (
    select kod_opl,
      case
        when dolg = 0 then dat_uch
        else '2100-12-31'::date
      end as closure_date
    from k2
  )
select kod_opl опл_id,
  closure_date дата_закрытия
from k3;
commit;
END;
$$;