import { DbObject, DpObjectProps } from "./DbObject";

export type ViewProps = DpObjectProps;
export class View extends DbObject {
  constructor(props: ViewProps) {
    super(props);
    if (!props.deleteStatement) {
      this.setDeleteStatement(
        /*sql*/ `DROP VIEW IF EXISTS  ${this.getObjectFullName()} CASCADE`
      );
    }
  }
}
