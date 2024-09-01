import report_dev from "./report_dev/report_dev";
import report_dm from "./report_dm";
import report_stg from "./report_stg";
import report_util from "./report_util";

export default [
  // report_dev,
  ...report_stg,
  ...report_dm,
  ...report_util
];
