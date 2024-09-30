import { execFunction, query } from '@/features/reports/services/pgsql';
import { DateEditor } from '@/features/reports/types/editors/DateEditor';
import { Field } from '@/features/reports/types/Field';
import { Form } from '@/features/reports/types/Form';
import { RegularReport } from '@/features/reports/types/reports/RegularReport';
import { ReportTable } from '@/features/reports/types/views/ReportTable';
import * as _ from 'lodash';

export default new RegularReport({
  title: 'Пример 5',
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
  dataSource: async (formValues) => {
    const result = await execFunction('report_util.get_rep_example1', {
      p_дата_с: formValues.date1,
      p_дата_по: formValues.date2,
    });
    const data = result as {
      отделение_аббр: any;
      год: any;
      месяц_имя: any;
      вид_реал_имя: any;
      начисл: any;
      погаш: any;
    }[];
    const data1 = _(data)
      .groupBy((it) => `${it.отделение_аббр}-${it.вид_реал_имя}-${it.год}`)
      .map((items) => {
        const item = items[0];
        return {
          отделение_аббр: item.отделение_аббр,
          год: item.год,
          вид_реал_имя: item.вид_реал_имя,
        };
      })
      .value();
    return data1;
  },
  view: new ReportTable({
    columns: [
      {
        caption: 'Тест',
        dataField: 'месяц.Август',
      },
    ],
  }),
});
