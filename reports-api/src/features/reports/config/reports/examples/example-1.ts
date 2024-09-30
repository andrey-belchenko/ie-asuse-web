import { execFunction } from '@/features/reports/services/pgsql';
import { DateEditor } from '@/features/reports/types/editors/DateEditor';
import { Field } from '@/features/reports/types/Field';
import { Form } from '@/features/reports/types/Form';
import { RegularReport } from '@/features/reports/types/reports/RegularReport';
import { ReportTable } from '@/features/reports/types/views/ReportTable';

export default new RegularReport({
  title: 'Пример 1',
  paramsForm: new Form({
    fields: [
      new Field({
        label: 'Дата с',
        name: 'date1',
        editor: new DateEditor({}),
      }),
      new Field({
        label: 'Дата по',
        name: 'date2',
        editor: new DateEditor({}),
      }),
    ],
  }),
  async dataSource(formValues) {
    return execFunction('report_util.get_rep_example1', {
      p_дата_с: formValues.date1,
      p_дата_по: formValues.date2,
    });
  },
  view: new ReportTable({}),
});
