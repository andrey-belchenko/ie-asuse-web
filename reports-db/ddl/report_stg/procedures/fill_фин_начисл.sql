CREATE OR REPLACE PROCEDURE report_stg.fill_фин_начисл () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_stg.фин_начисл a USING report_stg.refresh_slice rs
WHERE rs.договор_id = a.договор_id
  AND a.дата BETWEEN rs.дата_c AND rs.дата_по;
INSERT INTO report_stg.фин_начисл (
    refresh_slice_id,
    договор_id,
    вид_реал_id,
    док_нач_id,
    вид_тов_id,
    период_id,
    дата,
    начисл
  ) with x as (
    SELECT fv.kod_dog AS договор_id,
      fv.vid_real AS вид_реал_id,
      fv.kod_sf AS док_нач_id,
      fr.vid_t AS вид_тов_id,
      fv.ym AS период_id,
      report_stg.get_last_date_of_ym(fv.ym) AS дата,
      fr.nachisl as начисл,
      rs.refresh_slice_id refresh_slice_id,
      case
        when COALESCE(cl.дата_закрытия, '2100-01-01'::date) <= rs.дата_архивации then 1
        else 0
      end as архив,
      rs.дата_архивации
    FROM sr_facras fr
      LEFT JOIN sr_facvip fv ON fr.kod_sf = fv.kod_sf
      JOIN report_stg.refresh_slice rs ON rs.договор_id = fv.kod_dog
      AND fv.ym BETWEEN rs.период_с AND rs.период_по
      LEFT JOIN report_stg.фин_закрытие_начисл cl on cl.док_нач_id = fv.kod_sf
    WHERE fv.vid_sf NOT IN (2, 9)
  ),
  x1 as (
    select refresh_slice_id,
      договор_id,
      вид_реал_id,
      case
        when архив = 1 then NULL
        else док_нач_id
      end док_нач_id,
      вид_тов_id,
      case
        when архив = 1 then report_stg.get_ym_from_date(дата_архивации)
        else период_id
      end период_id,
      case
        when архив = 1 then дата_архивации
        else дата
      end дата,
      начисл,
      архив
    from x
  )
select max(refresh_slice_id) refresh_slice_id,
  договор_id,
  вид_реал_id,
  док_нач_id,
  вид_тов_id,
  период_id,
  дата,
  sum(начисл) начисл
from x1
GROUP BY договор_id,
  вид_реал_id,
  док_нач_id,
  вид_тов_id,
  период_id,
  дата;
commit;
END;
$$;