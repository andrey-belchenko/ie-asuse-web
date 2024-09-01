
import { DateEditor } from "../../types/editors/DateEditor";
import { Field } from "../../types/Field";
import { Form } from "../../types/Form";
import { RegularReport } from "../../types/reports/RegularReport";
import { DataSource } from "@/reports/types/DataSource";
import { ReportTable } from "@/reports/types/views/ReportTable";
import depSelect from "../fields/depSelect";

export default new RegularReport({
  title: "Оборотная ведомость за энергию",
  paramsForm: new Form({
    fields: [
      depSelect,
      new Field({
        label: "Дата с",
        name: "date1",
        editor: new DateEditor({}),
        defaultValue: () => new Date(2022, 2, 1),
      }),
      new Field({
        label: "Дата по",
        name: "date2",
        editor: new DateEditor({}),
        defaultValue: () => new Date(2022, 2, 31),
      }),
    ],
  }),
  dataSource: new DataSource({
    functionName: "report_util.get_оборотная_ведомость",
    paramsBinding: {
      p_дата_с: "date1",
      p_дата_по: "date2",
      p_отделение_id: "dep",
    },
  }),
  view: new ReportTable({
    columns: [
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
          { caption: "Кредит", dataField: "долг_кред_кон" },
        ],
      },
    ],

    // totalItems: [
    //   {
    //     column: "отделение_наименование",
    //     summaryType: "count",
    //   },
    //   {
    //     column: "долг_деб_нач",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "долг_кред_нач",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "начисл",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "погаш_оплатой",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "погаш_из_кред",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "опл_кред_аванс",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "опл_кред_перепл",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "долг_деб_кон",
    //     summaryType: "sum",
    //   },
    //   {
    //     column: "долг_кред_кон",
    //     summaryType: "sum",
    //   },
    // ],
    summary: {
      totalItems: [
        {
          column: "отделение_наименование",
          summaryType: "count",
        },
        ...[
          "долг_деб_нач",
          "долг_кред_нач",
          "начисл",
          "погаш_оплатой",
          "погаш_из_кред",
          "опл_кред_аванс",
          "опл_кред_перепл",
          "долг_деб_кон",
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
