import { Editor, type EditorProps } from '../Editor';
import { MethodParams } from '../MethodParams';

export interface SelectEditorProps extends EditorProps {
  columns: string[];
  listItems?: (params: MethodParams) => Promise<any[]>;
  keyField: string;
  displayField: string;
}

export class SelectEditor extends Editor {
  columns: string[];
  listItems?: (params: MethodParams) => Promise<any[]>;
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
