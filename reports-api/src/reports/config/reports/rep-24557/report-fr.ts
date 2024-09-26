import { RegularReport } from '../../../types/reports/RegularReport';
import { dataSetForFastReport } from './data-set';
import form from './form';
import { FastReportsViewer } from '@/reports/types/views/FastReportsViewer';
import * as path from 'path';

export default new RegularReport({
  title:
    'Просроченная задолженность РСО ИКУ по периодам возникновения (FastReport)',
  paramsForm: form,
  dataSource: dataSetForFastReport,
  view: new FastReportsViewer({
    templatePath: path.join(path.dirname(__filename), 'template1.frx'),
  }),
});
