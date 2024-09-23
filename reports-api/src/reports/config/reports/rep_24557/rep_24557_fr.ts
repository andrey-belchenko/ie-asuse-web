import { RegularReport } from '../../../types/reports/RegularReport';
import form from './form';
import ds from './ds';
import { FastReportsViewer } from '@/reports/types/views/FastReportsViewer';
import * as path from 'path';

export default new RegularReport({
  title:
    'Просроченная задолженности РСО ИКУ по периодам возникновения (FastReport)',
  paramsForm: form,
  dataSource: ds,
  view: new FastReportsViewer({
    templatePath: path.join(path.dirname(__filename), 'template1.frx'),
  }),
});
