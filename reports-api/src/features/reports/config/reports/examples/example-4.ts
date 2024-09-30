import { execFunction, query } from '@/features/reports/services/pgsql';
import { DateEditor } from '@/features/reports/types/editors/DateEditor';
import { Field } from '@/features/reports/types/Field';
import { Form } from '@/features/reports/types/Form';
import { RegularReport } from '@/features/reports/types/reports/RegularReport';
import { ReportTable } from '@/features/reports/types/views/ReportTable';

export default new RegularReport({
  title: 'Пример 4',
  paramsForm: new Form({
    fields: [
      new Field({
        label: 'Дата с',
        name: 'date1',
        editor: new DateEditor({}),
        defaultValue: () => new Date(2022, 5, 1),
      }),
      new Field({
        label: 'Дата по',
        name: 'date2',
        editor: new DateEditor({}),
        defaultValue: async () => (await query('select max(дата) val from report_dm.msr_фин_начисл'))[0].val,
      }),
    ],
  }),
  dataSource: (formValues) =>
    execFunction('report_util.get_rep_example1', {
      p_дата_с: formValues.date1,
      p_дата_по: formValues.date2,
    }),
  view: new ReportTable({
    columns: [
      {
        caption: 'Отделение',
        dataField: 'отделение_аббр',
      },
      {
        caption: 'Вид реализации',
        dataField: 'вид_реал_имя',
      },
      {
        caption: 'Период',
        columns: [
          {
            caption: 'Год',
            dataField: 'год',
          },
          {
            caption: 'Месяц',
            dataField: 'месяц_имя',
          },
        ],
      },
      {
        caption: 'Обороты',
        columns: [
          {
            caption: 'Начислено',
            dataField: 'начисл',
          },
          {
            caption: 'Оплачено',
            dataField: 'погаш',
          },
        ],
      },
    ],
    summary: {
      totalItems: [
        {
          column: 'отделение_аббр',
          summaryType: 'count',
        },
      ],
    },
  }),
});
