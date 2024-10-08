import { RegularReport } from '../../../types/reports/RegularReport';
import { ReportTable } from '@/features/reports/types/views/ReportTable';
import form from './form';
import { dataSetForTable } from './data-set';
import tableView from './table-view';

export default new RegularReport({
  title:
    'Просроченная задолженность РСО ИКУ по периодам возникновения (Таблица)',
  paramsForm: form,
  dataSource: dataSetForTable,
  view: tableView,
});
