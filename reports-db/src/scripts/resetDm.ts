import report_dm from "../declaration/report_dm";
import { resetObjects } from "../utils/management";

const run = async () => {
  await resetObjects(report_dm);
  console.log("done");
};

run();
