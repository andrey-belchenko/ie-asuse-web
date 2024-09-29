import { FastReportsViewer } from "@/features/reports/types/views/FastReportsViewer";
import { DateEditor } from "../../../types/editors/DateEditor";
import { Field } from "../../../types/Field";
import { Form } from "../../../types/Form";
import { RegularReport } from "../../../types/reports/RegularReport";
import { ReportTable } from "@/features/reports/types/views/ReportTable";
import depSelect from "../../fields/dep-select";

export default new RegularReport({
  title: "Оборотная ведомость за энергию (FastReport)",
  paramsForm: new Form({
    fields: [
      depSelect,
      new Field({
        label: "Дата с",
        name: "date1",
        editor: new DateEditor({}),
        defaultValue: async () => new Date(2022, 0, 1),
      }),
      new Field({
        label: "Дата по",
        name: "date2",
        editor: new DateEditor({}),
        defaultValue: async () => new Date(2022, 0, 31),
      }),
    ],
  }),
  view: new FastReportsViewer({ templatePath: "oborVed.frx" }),
});
