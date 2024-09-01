import { DbObject, DpObjectProps } from "./DbObject";

export type FunctionProps = DpObjectProps;
export class Function extends DbObject {
  constructor(props: FunctionProps) {
    super(props);
    if (!props.deleteStatement) {
      this.setDeleteStatement(
        /*sql*/ `DROP FUNCTION IF EXISTS  ${this.getObjectFullName()} `
      );
    }
  }
}
