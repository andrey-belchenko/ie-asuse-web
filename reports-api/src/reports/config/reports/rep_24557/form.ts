import { Form } from "@/reports/types/Form";
import { DateEditor } from "../../../types/editors/DateEditor";
import { Field } from "../../../types/Field";
import depSelect from "../../fields/depSelect";
import uchastokSelect from "../../fields/uchastokSelect";

export default  new Form({
    fields: [
      new Field({
        label: "Дата",
        name: "date",
        editor: new DateEditor({}),
        defaultValue: async () => new Date(2022, 2, 31),
      }),
      depSelect,
      uchastokSelect,
    ],
  })