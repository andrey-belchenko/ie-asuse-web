import { SelectEditor } from "@/reports/types/editors/SelectEditor";
import { Field } from "@/reports/types/Field";

export default new Field({
  label: "Отделение",
  name: "dep",
  editor: new SelectEditor({
    columns: ["аббр", "наименование"],
    keyField: "отделение_id",
    displayField: "аббр",
    tableName: "report_dm.dim_отделение",
  }),
});
