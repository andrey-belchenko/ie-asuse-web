import { uploadFile } from '@/pgsql';
import { ExcelTemplate } from '@/reports/services/ExcelTemplate';
import { DataSet } from '@/reports/types/DataSet';
import { Context } from '@/reports/types/reports/RegularReport';
import { FileViewer } from '@/reports/types/views/FileViewer';
import * as _ from 'lodash';
import * as path from 'path';

export default async function (context: Context, data: DataSet) {
  let template = new ExcelTemplate();
  await template.loadFile(path.join(path.dirname(__filename), 'template.xlsx'));
  await template.mapColumns([
    {
      from: 5,
      length: 2,
      items: async () => [
        { title: 'Колонка1' },
        { title: 'Колонка2' },
        { title: 'Колонка3' },
      ],
      apply: async (range, item) => {
        range.setValue(0, 2, item.title);
      },
    },
  ]);
  await template.mapRows([
    {
      from: 4,
      length: 5,
      items: async () => [1, 2, 3],
      loops: [
        {
          from: 1,
          length: 4,
          items: async () => [1, 2],
        },
      ],
    },
  ]);

  let fileId = 'test';
  let fileName = 'Отчет.xlsx';
  uploadFile({
    fileId,
    fileName,
    fileData: await template.result(),
  });
  return new FileViewer({
    fileId,
    fileName,
  });
}
