import path from "path";
import { DdlStatement } from "./DdlStatement";

export type DpObjectProps = {
  fileName: string;
  createStatement?: DdlStatement | string;
  deleteStatement?: DdlStatement | string;
  dependsOn?: DbObject[];
};

export class DbObject {
  fileName: string;
  private createStatement: DdlStatement;
  private deleteStatement: DdlStatement;
  dependsOn: DbObject[];
  dependent: DbObject[] = [];
  constructor(props: DpObjectProps) {
    this.fileName = props.fileName;
    if (props.createStatement) {
      if (typeof props.createStatement === "string") {
        this.createStatement = new DdlStatement({
          text: props.createStatement,
        });
      } else {
        this.createStatement = props.createStatement;
      }
    } else {
      this.createStatement = new DdlStatement({
        filePath: this.getDefaultSqlPath(this.fileName),
      });
    }

    this.deleteStatement = this.prepareDeleteStatement(props.deleteStatement);

    this.dependsOn = props.dependsOn || [];
    for (let parent of this.dependsOn) {
      parent.dependent.push(this);
    }
  }

  private prepareDeleteStatement(
    newValue: DdlStatement | string | undefined
  ): DdlStatement {
    let value: DdlStatement;
    if (newValue) {
      if (typeof newValue === "string") {
        value = new DdlStatement({
          text: newValue,
        });
      } else {
        value = newValue!!;
      }
    } else {
      value = new DdlStatement({
        text: "SELECT null",
      });
    }
    return value;
  }

  setDeleteStatement(value: DdlStatement | string | undefined) {
    this.deleteStatement = this.prepareDeleteStatement(value);
  }

  createSql(): string {
    return this.createStatement.getText();
  }

  deleteSql(): string {
    return this.deleteStatement.getText();
  }

  private getDefaultSqlPath(filePath: string) {
    let parsed = path.parse(filePath);
    let pathArray = parsed.dir.split(path.sep);
    let folderIndex = pathArray.indexOf("src");
    if (folderIndex > -1) {
      pathArray.splice(folderIndex, 1);
    }
    let newDir = pathArray.join(path.sep);
    let newExt = ".sql";
    let newFilePath = path.format({
      root: parsed.root,
      dir: newDir,
      name: parsed.name,
      ext: newExt,
    });
    return newFilePath;
  }

  getObjectFullName(): string {
    let parsed = path.parse(this.fileName);
    let pathArray = parsed.dir.split(path.sep);
    let folderIndex = pathArray.indexOf("ddl");
    let schemaName = pathArray[folderIndex + 1];
    let objectName = path.basename(this.fileName, path.extname(this.fileName));
    if (objectName != "index") {
      objectName = "." + objectName;
    } else {
      objectName = "";
    }
    return `${schemaName}${objectName}`;
  }
}
