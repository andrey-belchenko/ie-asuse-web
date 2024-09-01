import { DbObject, DpObjectProps } from "./DbObject";

export type TableProps = DpObjectProps;
export class Table extends DbObject {
  constructor(props: TableProps) {
    super(props);
    if (!props.deleteStatement) {
      this.setDeleteStatement(
        /*sql*/ `DROP TABLE IF EXISTS  ${this.getObjectFullName()} `
      );
    }
  }
}
