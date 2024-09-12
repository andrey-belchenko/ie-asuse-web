import { Editor, type EditorProps } from "../Editor";

export interface DateEditorProps extends EditorProps {}

export class DateEditor extends Editor {
  constructor(props: DateEditorProps) {
    super(props);
  }
}
