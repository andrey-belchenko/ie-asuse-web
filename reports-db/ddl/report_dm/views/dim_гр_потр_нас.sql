CREATE OR REPLACE VIEW report_dm.dim_гр_потр_нас AS --
with x as (
select a.kod_refcode as гр_потр_нас_id,
    a.name as имя,
    case
        when (a.kod_refcode in (356, 359, 354, 355)) then 1
        else (
            case
                when (a.kod_refcode in (363, 364, 361, 362)) then 2
                else null
            end
        )
    end as ику_рсо_id
from report_src.rs_refcode a
where a.kod_refbook = 103
)
select a.*,
    case
        a.ику_рсо_id
        when 1 then 'ИКУ'
        when 2 then 'РСО'
    end as ику_рсо_имя
from x a;