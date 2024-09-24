import { RegularReport } from '../../../types/reports/RegularReport';
import { ReportTable } from '@/reports/types/views/ReportTable';
import form from './form';
import { dataSetForTable } from './dataSet';

export default new RegularReport({
  title:
    'Просроченная задолженности РСО ИКУ по периодам возникновения (Таблица)',
  paramsForm: form,
  dataSource: dataSetForTable,
  view: async () => new ReportTable({}),
});
