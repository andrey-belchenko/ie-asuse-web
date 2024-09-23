import declaration from "../ddl";
import report_dm from "../ddl/report_dm";
import procedures_dm from "../ddl/report_dm/procedures";
import report_stg from "../ddl/report_stg";
import functions_stg from "../ddl/report_stg/functions";
import procedures_stg from "../ddl/report_stg/procedures";
import fill_фин_закрытие_начисл from "../ddl/report_stg/procedures/fill_фин_закрытие_начисл";
import fill_фин_закрытие_кред from "../ddl/report_stg/procedures/fill_фин_закрытие_кред";
import refresh_slice from "../ddl/report_stg/tables/refresh_slice";
import фин_закрытие_начисл from "../ddl/report_stg/tables/фин_закрытие_начисл";
import фин_закрытие_кред from "../ddl/report_stg/tables/фин_закрытие_кред";

import { resetObjects } from "../utils/management";
import fill_фин_опл from "../ddl/report_stg/procedures/fill_фин_опл";
import fill_фин_начисл from "../ddl/report_stg/procedures/fill_фин_начисл";
import get_лицевая_карта from "../ddl/report_util/лицевая_карта/get_лицевая_карта";
import report_util from "../ddl/report_util";
import dim_отделение from "../ddl/report_dm/views/dim_отделение";
import stg_functions from "../ddl/report_stg/functions";
import msr_фин_обор_просроч from "../ddl/report_dm/tables/msr_фин_обор_просроч";
import fill_msr_фин_обор_просроч from "../ddl/report_dm/procedures/fill_msr_фин_обор_просроч";
import msr_фин_обор from "../ddl/report_dm/tables/msr_фин_обор";
import fill_msr_фин_обор from "../ddl/report_dm/procedures/fill_msr_фин_обор";
import msr_фин_сальдо_по_дог_вид_реал from "../ddl/report_dm/tables/msr_фин_сальдо_по_дог_вид_реал";
import fill_msr_фин_сальдо_по_дог_вид_реал from "../ddl/report_dm/procedures/fill_msr_фин_сальдо_по_дог_вид_реал";
import оборотная_ведомость from "../ddl/report_util/оборотная_ведомость";
import latest from "../ddl/report_stg/functions/latest";
import msr_фин_сальдо_по_док_нач from "../ddl/report_dm/tables/msr_фин_сальдо_по_док_нач";
import fill_msr_фин_сальдо_по_док_нач from "../ddl/report_dm/procedures/fill_msr_фин_сальдо_по_док_нач";
import dim_договор from "../ddl/report_dm/views/dim_договор";
import dim_гр_потр_нас from "../ddl/report_dm/views/dim_гр_потр_нас";
import dim_участок from "../ddl/report_dm/views/dim_участок";
import dim_абонент from "../ddl/report_dm/views/dim_абонент";
import dim_док_нач from "../ddl/report_dm/views/dim_док_нач";
import фин_опл from "../ddl/report_stg/tables/фин_опл";
import get_rep_24557 from "../ddl/report_util/get_rep_24557";
import dim_дата from "../ddl/report_dm/tables/dim_дата";
import fill_dim_дата from "../ddl/report_dm/procedures/fill_dim_дата";
import get_month_name from "../ddl/report_stg/functions/get_month_name";
import report_sys from "../ddl/report_sys";

declaration;
const run = async () => {
  await resetObjects([
    //  refresh_slice,
    // ...procedures_stg,
    // ...functions_stg,
    // ...report_stg
    // ...report_dm
    // фин_закрытие_начисл,
    // fill_фин_закрытие_начисл,
    // фин_закрытие_кред,
    // fill_фин_закрытие_кред
    // fill_фин_начисл,
    // fill_фин_опл
    // get_лицевая_карта
    // ...report_util
    // dim_отделение,
    // ...stg_functions,
    // msr_фин_обор_просроч,
    // latest,
    // fill_msr_фин_обор_просроч,
    // msr_фин_обор,
    // fill_msr_фин_обор,
    // msr_фин_сальдо_по_дог_вид_реал,
    // fill_msr_фин_сальдо_по_дог_вид_реал,
    // msr_фин_сальдо_по_док_нач,
    // fill_msr_фин_сальдо_по_док_нач,
    // ...оборотная_ведомость,
    // dim_договор,
    // dim_гр_потр_нас,
    // dim_участок,
    // dim_абонент,
    // dim_док_нач
    // фин_опл,
    // fill_фин_опл
    // get_rep_24557,
    // get_month_name,
    // dim_дата,
    // fill_dim_дата,
    ...report_sys
    
  ]);
  console.log("done");
};

run();
