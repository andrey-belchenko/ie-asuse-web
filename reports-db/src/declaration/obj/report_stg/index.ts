import { Schema } from "../../../classes/Schema";
import functions from "./functions";
import procedures from "./procedures";
import tables from "./tables";

export default [
  new Schema({
    fileName: __filename,
    createStatement: /*sql*/ `CREATE SCHEMA report_stg`,
  }),
  ...tables,
  ...functions,
  ...procedures,
];
