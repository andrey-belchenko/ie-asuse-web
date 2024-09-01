import { Schema } from "../../classes/Schema";
import лицевая_карта from "./лицевая_карта";
import оборотная_ведомость from "./оборотная_ведомость";

export default [
  new Schema({
    fileName: __filename,
    createStatement: /*sql*/ `CREATE SCHEMA report_util`,
  }),
  ...лицевая_карта,
  ...оборотная_ведомость
];
