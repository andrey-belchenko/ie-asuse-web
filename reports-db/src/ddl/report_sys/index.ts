import { Schema } from "../../classes/Schema";
import tables from "./tables";

export default [
  new Schema({
    fileName: __filename,
    createStatement: /*sql*/ `CREATE SCHEMA report_sys`,
  }),
  ...tables,
];
