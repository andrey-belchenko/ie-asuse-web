import { DateEditor } from "../../types/editors/DateEditor";
import { Field } from "../../types/Field";
import { Form } from "../../types/Form";
import { RegularReport } from "../../types/reports/RegularReport";
import { ReportTable } from "@/reports/types/views/ReportTable";
import depSelect from "../fields/depSelect";
import { execFunction } from "@/pgsql";

export default new RegularReport({
  title: "Оборотная ведомость за энергию",
  paramsForm: new Form({
    fields: [
      depSelect,
      new Field({
        label: "Дата с",
        name: "date1",
        editor: new DateEditor({}),
        defaultValue:async () =>  new Date(2022, 1, 28),
      }),
      new Field({
        label: "Дата по",
        name: "date2",
        editor: new DateEditor({}),
        defaultValue:async () => new Date(2022, 2, 31),
      }),
    ],
  }),
  // dataSource: new DataSource({
  //   functionName: "report_util.get_оборотная_ведомость",
  //   paramsBinding: {
  //     p_дата_с: "date1",
  //     p_дата_по: "date2",
  //     p_отделение_id: "dep",
  //   },
  // }),
  dataSource: async (formValues)=>{
     return execFunction("report_util.get_оборотная_ведомость",{
      p_дата_с: formValues.date1,
      p_дата_по: formValues.date2,
      p_отделение_id: formValues.dep,
    })
  },
  view: new ReportTable({
    columns: [
      {
        caption: "Код договора",
        dataField: "договор_id",
      },
      {
        caption: "Отделение",
        dataField: "отделение_наименование",
      },
      {
        caption: "Договор",
        dataField: "договор_номер",
      },
      {
        caption: "Долг на начало",
        columns: [
          { caption: "Дебет", dataField: "долг_деб_нач" },
          { caption: "Просрочено", dataField: "долг_просроч_нач" },
          { caption: "Кредит", dataField: "долг_кред_нач" },
        ],
      },
      {
        caption: "Обороты",
        columns: [
          { caption: "Начислено", dataField: "начисл" },
          { caption: "Оплачено", dataField: "погаш_оплатой" },
          { caption: "Погашение за счет кредита", dataField: "погаш_из_кред" },
          { caption: "Оплата аванса", dataField: "опл_кред_аванс" },
          { caption: "Переплата", dataField: "опл_кред_перепл" },
        ],
      },
      {
        caption: "Долг на конец",
        columns: [
          { caption: "Дебет", dataField: "долг_деб_кон" },
          { caption: "Просрочено", dataField: "долг_просроч_кон" },
          { caption: "Кредит", dataField: "долг_кред_кон" },
        ],
      },
    ],
    summary: {
      totalItems: [
        {
          column: "отделение_наименование",
          summaryType: "count",
        },
        ...[
          "долг_деб_нач",
          "долг_просроч_нач",
          "долг_кред_нач",
          "начисл",
          "погаш_оплатой",
          "погаш_из_кред",
          "опл_кред_аванс",
          "опл_кред_перепл",
          "долг_деб_кон",
          "долг_просроч_кон",
          "долг_кред_кон",
        ].map((it) => ({
          column: it,
          summaryType: "sum",
          valueFormat: {
            type: "fixedPoint",
            precision: 2,
          },
          displayFormat: "{0}",
        })),
      ],
    },
  }),
});
