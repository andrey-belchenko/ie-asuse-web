call report_dm.fill_msr_фин_опл_кредит();
call report_dm.fill_msr_фин_опл_погаш();
call report_dm.fill_msr_фин_обор_просроч ();
call report_dm.fill_msr_фин_обор();
call report_dm.fill_msr_фин_сальдо_по_дог_вид_реал();
call report_dm.fill_msr_фин_сальдо_по_док_нач();


select * from report_dm.msr_фин_опл_погаш limit 1
select * from report_dm.msr_фин_опл_погаш limit 1

select * from report_dm.msr_фин_обор limit 1


select * from report_dm.msr_фин_сальдо_по_док_нач limit 1


