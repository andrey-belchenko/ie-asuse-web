import declaration from "../declaration";
import report_dm from "../declaration/report_dm";
import procedures_dm from "../declaration/report_dm/procedures";
import report_stg from "../declaration/report_stg";
import functions_stg from "../declaration/report_stg/functions";
import procedures_stg from "../declaration/report_stg/procedures";
import fill_фин_закрытие_начисл from "../declaration/report_stg/procedures/fill_фин_закрытие_начисл";
import fill_фин_закрытие_кред from "../declaration/report_stg/procedures/fill_фин_закрытие_кред";
import refresh_slice from "../declaration/report_stg/tables/refresh_slice";
import фин_закрытие_начисл from "../declaration/report_stg/tables/фин_закрытие_начисл";
import фин_закрытие_кред from "../declaration/report_stg/tables/фин_закрытие_кред";

import { resetObjects } from "../utils/management";
import fill_фин_опл from "../declaration/report_stg/procedures/fill_фин_опл";
import fill_фин_начисл from "../declaration/report_stg/procedures/fill_фин_начисл";
import get_лицевая_карта from "../declaration/report_util/лицевая_карта/get_лицевая_карта";
import report_util from "../declaration/report_util";
import dim_отделение from "../declaration/report_dm/views/dim_отделение";

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
    ...report_util
    // dim_отделение
  ]);
  console.log("done");
};

run();
