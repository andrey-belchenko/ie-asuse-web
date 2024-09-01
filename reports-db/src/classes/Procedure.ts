import { DbObject, DpObjectProps } from "./DbObject";

export type ProcedureProps = DpObjectProps;
export class Procedure extends DbObject {
  constructor(props: ProcedureProps) {
    super(props);
    if (!props.deleteStatement) {
      this.setDeleteStatement(
        /*sql*/ `DROP PROCEDURE IF EXISTS  ${this.getObjectFullName()} `
      );
    }
  }
}
