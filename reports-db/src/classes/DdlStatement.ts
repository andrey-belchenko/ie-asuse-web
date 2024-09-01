import path from "path";
import fs from "fs";
import { text } from "stream/consumers";

export type DdlStatementProps =
  | {
      filePath: string;
    }
  | {
      text: string;
    };

export class DdlStatement {
  text?: string;
  fileName?: string;
  constructor(props: DdlStatementProps) {
    if ("text" in props) {
      this.text = props.text;
    } else {
      this.fileName = props.filePath;
      this.text = fs.readFileSync(this.fileName, "utf8");
    }
  }

  // init(dirName: string | undefined): DdlStatement | undefined {
  //   if (this.text) {
  //     return this;
  //   } else {
  //     this.text = fs.readFileSync(
  //       path.join(dirName!!, this.fileName!!),
  //       "utf8"
  //     );
  //     return this;
  //   }
  // }

  getText(): string {
    return this.text!!;
  }
}
