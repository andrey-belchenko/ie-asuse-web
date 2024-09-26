import type { Editor } from './Editor';
import { ConfigItem } from './ConfigItem';
import { Method } from './Method';

export interface FieldProps {
  label: string;
  name: string;
  editor: Editor;
  defaultValue?: Method;
  defaultValueDeps?: string[];
}

export class Field extends ConfigItem {
  label: string;
  name: string;
  editor: Editor;
  defaultValue?: () => Promise<any>;
  defaultValueDeps?: string[];
  constructor(props: FieldProps) {
    super();
    this.label = props.label;
    this.editor = props.editor;
    this.name = props.name;
    this.defaultValue = props.defaultValue;
    this.defaultValueDeps = props.defaultValueDeps;
  }
}
