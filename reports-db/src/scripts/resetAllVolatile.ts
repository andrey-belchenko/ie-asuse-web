import report_dm from "../ddl/report_dm";
import fill_фин_начисл from "../ddl/report_stg/procedures/fill_фин_начисл";
import fill_фин_опл from "../ddl/report_stg/procedures/fill_фин_опл";
import фин_начисл from "../ddl/report_stg/tables/фин_начисл";
import фин_опл from "../ddl/report_stg/tables/фин_опл";
import report_util from "../ddl/report_util";
import { resetObjects } from "../utils/management";

const stgObj = [фин_начисл, фин_опл, fill_фин_начисл, fill_фин_опл];
const run = async () => {
  await resetObjects([...stgObj, ...report_dm, ...report_util]);
  console.log("done");
};

run();
