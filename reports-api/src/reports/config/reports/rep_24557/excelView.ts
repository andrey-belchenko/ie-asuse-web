import { uploadFile } from '@/pgsql';
import { ExcelTemplate } from '@/reports/services/ExcelTemplate';
import { DataSet } from '@/reports/types/DataSet';
import { Context } from '@/reports/types/reports/RegularReport';
import { FileViewer } from '@/reports/types/views/FileViewer';
import * as _ from 'lodash';
import * as path from 'path';

export default async function (context: Context, data: DataSet) {
  let columnsInfo = data['columns'];

  let bandsInfos = _(columnsInfo)
    .map((it) => ({
      column_id: it.column_id,
      период_id: it.период_id,
      период_имя: it.период_имя,
      год: it.год,
      месяц_имя: it.месяц_имя,
      месяц: it.месяц,
      name: it.name,
    }))
    .groupBy((it) => it.период_id)
    .values()
    .sortBy((it) => it[0].column_id)
    .value();

  let template = new ExcelTemplate();
  await template.loadFile(path.join(path.dirname(__filename), 'template.xlsx'));
  await template.mapColumns([
    {
      from: 4,
      length: 2,
      items: async () => bandsInfos,
      apply: async (range, item) => {
        let it = item[0];
        range.setValue(
          0,
          2,
          it.год
            ? `Просроченная задолженность за ${it.год} год, в т.ч. `
            : it.период_имя,
        );
      },
      loops: [
        {
          from: 1,
          length: 1,
          items: async (parentItem) =>
            _(parentItem)
              .filter((it) => it.месяц_имя)
              .value(),
          apply: async (range, item) => {
            range.setValue(0, 2, `${item.месяц_имя} ${item.год} года`);
          },
        },
      ],
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
