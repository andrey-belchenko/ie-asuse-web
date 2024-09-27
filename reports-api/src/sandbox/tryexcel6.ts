import { getDataSetFromTemp } from '@/features/reports/services/mongo';
import { downloadFile } from '@/features/reports/services/pgsql';
import excelView from '@/features/reports/config/reports/rep-24557/excel-view';

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  let data = await getDataSetFromTemp('nav10.items.0.items.0.items.0');
  await excelView({ formValues: { date: new Date(2020, 2, 31) } }, data);
  let file = await downloadFile('test');
  let trgPath = path.join(path.dirname(__filename), file.fileName);
  fs.writeFileSync(trgPath, file.fileData);
  console.log('done');
}

main();
