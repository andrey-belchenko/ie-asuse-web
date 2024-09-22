import { RegularReport } from '../../../types/reports/RegularReport';
import { ReportTable } from '@/reports/types/views/ReportTable';
import form from './form';
import ds from './ds';

export default new RegularReport({
  title:
    'Просроченная задолженности РСО ИКУ по периодам возникновения (Таблица)',
  paramsForm: form,
  dataSource: ds,
  view: new ReportTable({}),
});
