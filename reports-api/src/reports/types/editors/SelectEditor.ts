import { Editor, type EditorProps } from "../Editor";

export interface SelectEditorProps extends EditorProps {
  columns: string[];
  listItems?: () => Promise<any[]>;
  keyField: string;
  displayField: string;
}

export class SelectEditor extends Editor {
  columns: string[];
  listItems?: () => Promise<any[]>;
  keyField: string;
  displayField: string;
  constructor(props: SelectEditorProps) {
    super(props);
    this.columns = props.columns;
    this.keyField = props.keyField;
    this.displayField = props.displayField;
    this.listItems = props.listItems;
  }
}
