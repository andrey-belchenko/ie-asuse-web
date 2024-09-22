import { RegularReport } from '../../../types/reports/RegularReport';
import { DataSource } from '@/reports/types/DataSource';
import { ReportTable } from '@/reports/types/views/ReportTable';
import form from './form';
import ds from './ds';
import { FastReportsViewer } from '@/reports/types/views/FastReportsViewer';

export default new RegularReport({
  title:
    'Просроченная задолженности РСО ИКУ по периодам возникновения (FastReport)',
  paramsForm: form,
  dataSource: ds,
  view: new FastReportsViewer({ templateName: '' }),
});
