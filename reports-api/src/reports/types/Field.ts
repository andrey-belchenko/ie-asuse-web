import type { Editor } from "./Editor";

export interface FieldProps {
  label: string;
  name: string;
  editor: Editor;
  defaultValue?: () => any;
}

export class Field {
  label: string;
  name: string;
  editor: Editor;
  defaultValue?: () => any;
  constructor(props: FieldProps) {
    this.label = props.label;
    this.editor = props.editor;
    this.name = props.name;
    this.defaultValue = props.defaultValue;
  }
}
