import type { Field } from "./Field";

export interface FormProps {
  fields: Field[];
}
export class Form {
  fields: Field[];
  constructor(props: FormProps) {
    this.fields = props.fields;
  }
}
