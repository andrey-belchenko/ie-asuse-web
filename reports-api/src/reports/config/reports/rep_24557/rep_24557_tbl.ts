import { RegularReport } from '../../../types/reports/RegularReport';
import { ReportTable } from '@/reports/types/views/ReportTable';
import form from './form';
import { dataSetForTable } from './dataSet';
import tableView from './tableView';

export default new RegularReport({
  title:
    'Просроченная задолженность РСО ИКУ по периодам возникновения (Таблица)',
  paramsForm: form,
  dataSource: dataSetForTable,
  view: tableView,
});
