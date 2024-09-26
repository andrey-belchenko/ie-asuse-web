import { RegularReport } from '../../../types/reports/RegularReport';
import form from './form';
import { dataSetForTable } from './data-set';
import excelView from './excel-view';

export default new RegularReport({
  title:
    'Просроченная задолженность РСО ИКУ по периодам возникновения (Excel)',
  paramsForm: form,
  dataSource: dataSetForTable,
  view: excelView,
});
