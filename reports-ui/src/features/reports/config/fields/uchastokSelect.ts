import { SelectEditor } from "@/features/reports/types/editors/SelectEditor";
import { Field } from "@/features/reports/types/Field";

export default new Field({
  label: "Участок",
  name: "uchastok",
  editor: new SelectEditor({
    columns: ["имя"],
    keyField: "участок_id",
    displayField: "сокр_имя",
    tableName: "report_dm.dim_участок",
  }),
});
