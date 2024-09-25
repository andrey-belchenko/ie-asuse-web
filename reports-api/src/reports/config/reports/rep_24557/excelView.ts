import { DataSet } from '@/reports/types/DataSet';
import { Context } from '@/reports/types/reports/RegularReport';
import { ExcelViewer } from '@/reports/types/views/ExcelViewer';
import * as _ from 'lodash';
import * as path from 'path';
export default async function (context: Context, data: DataSet) {
  
  return new ExcelViewer({
    templatePath: path.join(path.dirname(__filename), 'template.xlsx'),
  });
}
