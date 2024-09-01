CREATE OR REPLACE VIEW report_dm.msr_фин_опер AS
SELECT 
  договор_id, 
  вид_реал_id, 
  дата, 
  док_нач_id, 
  начисл, 
  NULL::numeric AS погаш_оплатой_без_аванса, 
  NULL::numeric AS погаш_оплатой_аванс, 
  NULL::numeric AS погаш_из_перепл, 
  NULL::numeric AS погаш_из_аванса, 
  NULL::numeric AS погаш_оплатой, 
  NULL::numeric AS погаш_из_кред, 
  NULL::numeric AS погаш, 
  NULL::numeric AS погаш_без_аванса, 
  NULL::numeric AS опл_кред_перепл, 
  NULL::numeric AS опл_кред_аванс, 
  NULL::numeric AS сторно_кред_перепл, 
  NULL::numeric AS обор_кред, 
  NULL::numeric AS опл_кред, 
  NULL::numeric AS сторно_кред 
FROM 
  report_dm.msr_фин_начисл 
UNION ALL 
SELECT 
  договор_id, 
  вид_реал_id, 
  дата, 
  док_нач_id, 
  NULL, 
  погаш_оплатой_без_аванса, 
  погаш_оплатой_аванс, 
  погаш_из_перепл, 
  погаш_из_аванса, 
  погаш_оплатой, 
  погаш_из_кред, 
  погаш, 
  погаш_без_аванса, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL 
FROM 
  report_dm.msr_фин_опл_погаш 
UNION ALL 
SELECT 
  договор_id, 
  вид_реал_id, 
  дата, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  NULL, 
  опл_кред_перепл, 
  опл_кред_аванс, 
  сторно_кред_перепл, 
  обор_кред, 
  опл_кред, 
  сторно_кред 
FROM 
  report_dm.msr_фин_опл_кредит;