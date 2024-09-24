import { Editor, type EditorProps } from '../Editor';
import { Method } from '../Method';

export interface SelectEditorProps extends EditorProps {
  columns: string[];
  listItems?: Method;
  listItemsDeps?: string[];
  keyField: string;
  displayField: string;
}

export class SelectEditor extends Editor {
  columns: string[];
  listItems?: Method;
  listItemsDeps?: string[];
  keyField: string;
  displayField: string;
  constructor(props: SelectEditorProps) {
    super(props);
    this.columns = props.columns;
    this.keyField = props.keyField;
    this.displayField = props.displayField;
    this.listItems = props.listItems;
    this.listItemsDeps = props.listItemsDeps;
  }
}
