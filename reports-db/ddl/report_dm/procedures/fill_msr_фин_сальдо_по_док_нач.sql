CREATE OR REPLACE PROCEDURE report_dm.fill_msr_фин_сальдо_по_док_нач () LANGUAGE plpgsql AS $$ BEGIN --
 -- Удаляются все записи с периодом позже начала затронутого периода
DELETE FROM report_dm.msr_фин_сальдо_по_док_нач a USING report_stg.refresh_slice rs
WHERE rs.договор_id = a.договор_id
    AND a.акт_с >= rs.дата_c;
INSERT INTO report_dm.msr_фин_сальдо_по_док_нач (
        refresh_slice_id,
        договор_id,
        док_нач_id,
        вид_реал_id,
        акт_с,
        акт_по,
        долг_деб,
        долг_деб_просроч
    ) with prd as (
        select договор_id,
            refresh_slice_id,
            (дата_c - INTERVAL '1 day')::date дата
        from report_stg.refresh_slice
    ),
    -- Сальдо на начало затронутого периода, по сути все обороты до начала затронутого периода
    oold as (
        select prd.дата,
            a.договор_id,
            a.вид_реал_id,
            a.док_нач_id,
            a.долг_деб обор_деб,
            a.долг_деб_просроч обор_деб_просроч
        from report_dm.msr_фин_сальдо_по_док_нач a
            JOIN prd ON prd.договор_id = a.договор_id
            AND prd.дата BETWEEN a.акт_с AND a.акт_по
    ),
    -- Обороты после начала затронутого периода
    onew as (
        select a.дата,
            a.договор_id,
            a.вид_реал_id,
            a.док_нач_id,
            sum(a.обор_деб) обор_деб,
            sum(a.обор_деб_просроч) обор_деб_просроч
        from report_dm.msr_фин_обор a
            JOIN prd ON prd.договор_id = a.договор_id
            AND a.дата > prd.дата
        group by a.дата,
            a.договор_id,
            a.вид_реал_id,
            a.док_нач_id
    ),
    x1 as (
        select *
        from oold
        union all
        select *
        from onew
    ),
    x2 as (
        select -- дата следующей записи в оборотах (дата до которой будет актуально значение сальдо полученное нарастающим итогом)
            coalesce(
                (
                    LEAD(a.дата) OVER (
                        PARTITION BY a.договор_id,
                        a.вид_реал_id,
                        a.док_нач_id
                        ORDER BY a.дата
                    ) - INTERVAL '1 day'
                )::date,
                '2100-12-31'
            ) as акт_по,
            a.*
        from x1 a
    ),
    x3 as (
        -- сальдо как нарастающий итог по оборотам
        select SUM(a.обор_деб) OVER (
                PARTITION BY a.договор_id,
                a.вид_реал_id,
                a.док_нач_id
                ORDER BY a.дата
            ) as долг_деб,
            SUM(a.обор_деб_просроч) OVER (
                PARTITION BY a.договор_id,
                a.вид_реал_id,
                a.док_нач_id
                ORDER BY a.дата
            ) as долг_деб_просроч,
            a.*
        from x2 a
    )
select prd.refresh_slice_id,
    a.договор_id,
    a.вид_реал_id,
    a.док_нач_id,
    a.дата as акт_с,
    a.акт_по,
    a.долг_деб,
    a.долг_деб_просроч
from x3 a --исключаются записи с оборотами до начала затронутого периода которые были добавлены в начале oold
    JOIN prd ON prd.договор_id = a.договор_id
    AND a.дата > prd.дата;
commit;
END;
$$;