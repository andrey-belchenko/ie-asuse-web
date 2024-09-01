import { Schema } from "../../classes/Schema";

export default new Schema({
  fileName: __filename,
  createStatement: /*sql*/ `CREATE SCHEMA report_dev`,
});
