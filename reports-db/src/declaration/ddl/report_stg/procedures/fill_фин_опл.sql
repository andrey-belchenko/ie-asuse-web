CREATE OR REPLACE PROCEDURE report_stg.fill_фин_опл () LANGUAGE plpgsql AS $$ BEGIN
DELETE FROM report_stg.фин_опл a USING report_stg.refresh_slice rs
WHERE rs.договор_id = a.договор_id
    AND a.дата BETWEEN rs.дата_c AND rs.дата_по;
CREATE TEMP TABLE tmp1 ON COMMIT DROP AS
select rs.refresh_slice_id,
    o.kod_dog as договор_id,
    o.kod_opl as опл_id,
    o.vid_real AS вид_реал_id,
    o.kod_type_opl as тип_опл_id,
    o.kod_parent as исх_опл_id,
    o.kod_sf as док_нач_id,
    o.dat_uch as дата,
    o.ym AS период_id,
    coalesce(o.opl, 0) + coalesce(o.opls, 0) as опл,
    COALESCE(
        clo.дата_закрытия,
        clop.дата_закрытия,
        cln.дата_закрытия,
        '2100-01-01'::date
    ) дата_закрытия,
    rs.дата_архивации
from sr_opl o
    join report_stg.refresh_slice rs on rs.договор_id = o.kod_dog
    and o.ym BETWEEN rs.период_с and rs.период_по
    LEFT JOIN report_stg.фин_закрытие_начисл cln on cln.док_нач_id = o.kod_sf
    LEFT JOIN report_stg.фин_закрытие_кред clo on clo.опл_id = o.kod_opl
    LEFT JOIN report_stg.фин_закрытие_кред clop on clop.опл_id = o.kod_parent;
INSERT INTO report_stg.фин_опл (
        refresh_slice_id,
        договор_id,
        опл_id,
        вид_реал_id,
        тип_опл_id,
        исх_опл_id,
        док_нач_id,
        дата,
        период_id,
        опл
    ) with 
    x as (
        select a.*,
            case
                when a.дата_закрытия <= a.дата_архивации then 1
                else 0
            end as архив
        from tmp1 a
    ),
    x1 as (
        select refresh_slice_id,
            договор_id,
            case
                when архив = 1 then null
                else опл_id
            end опл_id,
            вид_реал_id,
            тип_опл_id,
            case
                when архив = 1 then null
                else исх_опл_id
            end исх_опл_id,
            case
                when архив = 1 then null
                else док_нач_id
            end док_нач_id,
            case
                when архив = 1 then дата_архивации
                else дата
            end дата,
            case
                when архив = 1 then report_stg.get_ym_from_date(дата_архивации)
                else период_id
            end период_id,
            опл
        from x
    )
select max(refresh_slice_id) refresh_slice_id,
    договор_id,
    опл_id,
    вид_реал_id,
    тип_опл_id,
    исх_опл_id,
    док_нач_id,
    дата,
    период_id,
    sum(опл) опл
from x1
GROUP BY договор_id,
    опл_id,
    вид_реал_id,
    тип_опл_id,
    исх_опл_id,
    док_нач_id,
    дата,
    период_id;
commit;
END;
$$;