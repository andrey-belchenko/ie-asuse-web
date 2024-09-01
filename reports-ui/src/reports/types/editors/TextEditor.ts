import { Editor, type EditorProps } from "../Editor";

export interface TextEditorProps extends EditorProps {}

export class TextEditor extends Editor {
  constructor(props: TextEditorProps) {
    super(props);
  }
}
