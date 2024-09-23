import { RegularReport } from '../../../types/reports/RegularReport';
import { ReportTable } from '@/reports/types/views/ReportTable';
import form from './form';
import dataSet from './dataSet';

export default new RegularReport({
  title:
    'Просроченная задолженности РСО ИКУ по периодам возникновения (Таблица)',
  paramsForm: form,
  dataSource: dataSet,
  view: new ReportTable({}),
});
