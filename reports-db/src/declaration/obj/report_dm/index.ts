import { Schema } from "../../../classes/Schema";
import procedures from "./procedures";
import tables from "./tables";
import views from "./views";

export default [
  new Schema({
    fileName: __filename,
    createStatement: /*sql*/ `CREATE SCHEMA report_dm`,
  }),
  ...tables,
  ...views,
  ...procedures,
];
