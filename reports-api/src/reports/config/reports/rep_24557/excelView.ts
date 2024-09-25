import { DataSet } from '@/reports/types/DataSet';
import { Context } from '@/reports/types/reports/RegularReport';
import { ExcelViewer } from '@/reports/types/views/ExcelViewer';
import * as _ from 'lodash';
import * as path from 'path';
export default async function (context: Context, data: DataSet) {
  let view = new ExcelViewer({
    templatePath: path.join(path.dirname(__filename), 'template.xlsx'),
  });

  view.mapColumns([
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

  view.mapRows([
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
  return view;
}
