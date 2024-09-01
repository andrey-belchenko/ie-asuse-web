import report_dm from "../ddl/report_dm";
import { resetObjects } from "../utils/management";

const run = async () => {
  await resetObjects(report_dm);
  console.log("done");
};

run();
