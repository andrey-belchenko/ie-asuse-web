import type { Field } from "./Field";
import { ConfigItem } from './ConfigItem';

export interface FormProps {
  fields: Field[];
}
export class Form  extends ConfigItem {
  fields: Field[];
  constructor(props: FormProps) {
    super();
    this.fields = props.fields;
  }
}
