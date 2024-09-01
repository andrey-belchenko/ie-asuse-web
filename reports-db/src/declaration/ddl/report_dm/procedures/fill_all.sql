CREATE OR REPLACE PROCEDURE report_dm.fill_all () LANGUAGE plpgsql AS $$ BEGIN 
call report_dm.fill_dim_дата();
call report_dm.fill_msr_фин_начисл();
call report_dm.fill_msr_фин_опл_кредит();
call report_dm.fill_msr_фин_опл_погаш();
call report_dm.fill_msr_фин_обор();
call report_dm.fill_msr_фин_сальдо_по_дог_вид_реал();
-- call report_dm.fill_msr_фин_сальдо_по_дог();
-- call report_dm.fill_msr_фин();
END;
$$;