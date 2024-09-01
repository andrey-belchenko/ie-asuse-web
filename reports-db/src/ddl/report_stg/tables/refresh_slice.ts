import { Table } from "../../../classes/Table";

export default new Table({
  fileName: __filename,
  deleteStatement: /*sql*/ `
    DROP TABLE IF EXISTS report_stg.refresh_slice;
    DROP FUNCTION IF EXISTS report_stg.refresh_slice_tr_func;
  `,
});
