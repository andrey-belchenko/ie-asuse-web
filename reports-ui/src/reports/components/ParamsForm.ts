import FieldDate from "./editors/DateEditor.vue";
import FieldText from "./editors/TextEditor.vue";
import FieldSelect from "./editors/SelectEditor.vue";
import type { Editor } from "../types/Editor";
import { DateEditor } from "../types/editors/DateEditor";
import { TextEditor } from "../types/editors/TextEditor";
import { SelectEditor } from "../types/editors/SelectEditor";
import type { Form } from "../types/Form";

export const getEditorComponent = (editor: Editor) => {
  if (editor instanceof DateEditor) {
    return FieldDate;
  } else if (editor instanceof TextEditor) {
    return FieldText;
  } else if (editor instanceof SelectEditor) {
    return FieldSelect;
  } else {
    throw new Error(`Invalid editor type: ${editor}`);
  }
};

export const getDefaultValues = (formConfig: Form) => {
  const newValues: any = {};
  for (let field of formConfig.fields) {
    if (field.defaultValue) {
      newValues[field.name] = field.defaultValue();
    }
  }
  return newValues;
};
