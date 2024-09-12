import type { Editor } from "./Editor";
import { ConfigItem } from './ConfigItem';

export interface FieldProps {
  label: string;
  name: string;
  editor: Editor;
  defaultValue?: () => any;
}

export class Field  extends ConfigItem {
  label: string;
  name: string;
  editor: Editor;
  defaultValue?: () => any;
  constructor(props: FieldProps) {
    super();
    this.label = props.label;
    this.editor = props.editor;
    this.name = props.name;
    this.defaultValue = props.defaultValue;
  }
}
