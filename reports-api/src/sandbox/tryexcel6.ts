import { getDataSetFromTemp } from '@/mongo';
import { downloadFile } from '@/pgsql';
import excelView from '@/reports/config/reports/rep_24557/excelView';

import * as fs from 'fs';
import * as path from 'path';

async function main() {
  let data = await getDataSetFromTemp("nav10.items.0.items.0.items.0");
  await excelView(undefined, data);
  let file = await downloadFile('test');
  let trgPath = path.join(path.dirname(__filename), file.fileName);
  fs.writeFileSync(trgPath, file.fileData);
  console.log('done');
}

main();
