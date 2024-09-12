import { Editor, type EditorProps } from "../Editor";

export interface SelectEditorProps extends EditorProps {
  columns: string[];
  data?: any[];
  tableName?: string;
  keyField: string;
  displayField: string;
}

export class SelectEditor extends Editor {
  columns: string[];
  data?: any[];
  tableName?: string;
  keyField: string;
  displayField: string;
  constructor(props: SelectEditorProps) {
    super(props);
    this.columns = props.columns;
    this.data = props.data;
    this.keyField = props.keyField;
    this.displayField = props.displayField;
    this.tableName= props.tableName;
  }
}
