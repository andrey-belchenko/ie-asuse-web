import { Schema } from "../../classes/Schema";
import get_rep_24557 from "./get_rep_24557";
import лицевая_карта from "./лицевая_карта";
import оборотная_ведомость from "./оборотная_ведомость";
import примеры from "./примеры";
export default [
  new Schema({
    fileName: __filename,
    createStatement: /*sql*/ `CREATE SCHEMA report_util`,
  }),
  ...лицевая_карта,
  ...оборотная_ведомость,
  get_rep_24557,
  ...примеры
  
];
