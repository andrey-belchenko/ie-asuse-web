import { DateEditor } from "../../types/editors/DateEditor";
import { Field } from "../../types/Field";
import { Form } from "../../types/Form";
import { RegularReport } from "../../types/reports/RegularReport";
import { DataSource } from "@/reports/types/DataSource";
import { ReportTable } from "@/reports/types/views/ReportTable";
import depSelect from "../fields/depSelect";
import uchastokSelect from "../fields/uchastokSelect";

export default new RegularReport({
  title: "Просроченная задолженности РСО ИКУ по периодам возникновения",
  paramsForm: new Form({
    fields: [
      new Field({
        label: "Дата",
        name: "date",
        editor: new DateEditor({}),
        defaultValue: () => new Date(2022, 2, 31),
      }),
      depSelect,
      uchastokSelect,
    ],
  }),
  dataSource: new DataSource({
    functionName: "report_util.get_rep_24557",
    paramsBinding: {
      p_дата:"date",
      p_отделение_id:"dep",
      p_участок_id:"uchastok"
    },
  }),
  view: new ReportTable({}),
});
