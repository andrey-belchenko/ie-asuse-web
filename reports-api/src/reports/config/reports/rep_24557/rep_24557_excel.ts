import { RegularReport } from '../../../types/reports/RegularReport';
import form from './form';
import { dataSetForTable } from './dataSet';
import excelView from './excelView';

export default new RegularReport({
  title:
    'Просроченная задолженность РСО ИКУ по периодам возникновения (Excel)',
  paramsForm: form,
  dataSource: dataSetForTable,
  view: excelView,
});
