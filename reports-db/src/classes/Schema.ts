import { DbObject, DpObjectProps } from "./DbObject";

export type SchemaProps = DpObjectProps;
export class Schema extends DbObject {
  constructor(props: SchemaProps) {
    super(props);
    if (!props.deleteStatement) {
      this.setDeleteStatement(
        /*sql*/ `DROP SCHEMA IF EXISTS  ${this.getObjectFullName()}  CASCADE`
      );
    }
  }
}
