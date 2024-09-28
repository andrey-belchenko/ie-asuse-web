import { saveFile } from '@/features/reports/services/pgsql';
import {
  ExcelTemplate,
  TemplateRange,
} from '@/features/reports/services/ExcelTemplate';
import { DataSet } from '@/features/reports/types/DataSet';
import { Context } from '@/features/reports/types/reports/RegularReport';
import { FileViewer } from '@/features/reports/types/views/FileViewer';

import * as moment from 'moment';
import * as path from 'path';
import { grouping } from '@/features/reports/services/transform';
import * as _ from 'lodash';

export default async function (context: Context, data: DataSet) {
  let columns = data['columns'] as {
    column_id: any;
    период_id: any;
    период_имя: any;
    год: any;
    месяц_имя: any;
    месяц: any;
    name: any;
  }[];

  let groupedColumns = _(columns)
    .groupBy((it) => it.период_id)
    .values()
    .sortBy((it) => it[0].column_id)
    .value();

  let rows = data['main'] as {
    договор_id: any;
    договор_номер: any;
    абонент_имя: any;
    отделение_имя: any;
    участок_имя: any;
    ику_рсо_имя: any;
    гр_потр_нас_имя: any;
    год: any;
    период_id: any;
    месяц_имя: any;
    месяц: any;
    долг: any;
  }[];

  let groupedData = grouping(rows, (row) => [
    null,
    row.отделение_имя,
    row.ику_рсо_имя,
    row.участок_имя,
    row.гр_потр_нас_имя,
    row.договор_id,
  ]);

  let template = new ExcelTemplate();
  await template.loadFile(path.join(path.dirname(__filename), 'template.xlsx'));

  let dynamicColNames: string[] = [];
  await template.mapColumns((range) => {
    range.loop(
      4,
      2,
      () => groupedColumns,
      (range, colsInGroup) => {
        let first = colsInGroup[0];
        range.setValue(
          0,
          2,
          first.год
            ? `Просроченная задолженность за ${first.год} год, в т.ч.`
            : first.период_имя,
        );
        dynamicColNames.push(first.name);
        range.loop(
          1,
          1,
          () =>
            _(colsInGroup)
              .filter((it) => it.месяц_имя)
              .value(),
          (range, item) => {
            dynamicColNames.push(item.name);
            range.setValue(0, 2, `${item.месяц_имя} \r ${item.год} года`);
          },
        );
      },
    );
  });

  const setRowValues = (range: TemplateRange, item: any, rowIndex = 0) => {
    range.setValue(rowIndex, 3, item.summary.долг);
    range.setValues(
      rowIndex,
      4,
      dynamicColNames.map((name) => item.summary[name] || 0),
    );
  };

  await template.mapRows((range) => {
    range.setValue(
      2,
      3,
      `Просроченная задолженность на ${moment(context.formValues.date).format('DD.MM.YYYY')} года , в т.ч.`,
    );

    setRowValues(range, groupedData[0], 3);
    range.loop(
      4,
      5,
      () => groupedData[0].items,
      (range, item) => {
        range.setValue(0, 2, `Итого по ${item.props.отделение_имя}`);
        setRowValues(range, item);
        range.loop(1, 4, item.items, (range, item) => {
          range.setValue(
            0,
            2,
            `Итого ${item.props.ику_рсо_имя} по ${item.props.отделение_имя}`,
          );
          setRowValues(range, item);
          range.loop(1, 3, item.items, (range, item) => {
            range.setValue(
              0,
              2,
              `Итого ${item.props.ику_рсо_имя} по ${item.props.участок_имя}, в т.ч.`,
            );
            setRowValues(range, item);
            range.loop(1, 2, item.items, (range, item) => {
              range.setValue(
                0,
                2,
                item.props.гр_потр_нас_имя,
              );
              setRowValues(range, item);
              range.loop(1, 1, item.items, (range, item) => {
                range.setValue(
                  0,
                  2,
                  item.props.абонент_имя,
                );
                setRowValues(range, item);
              });
            });
          });
        });
      },
    );
  });

  let fileId = 'test';
  let fileName = 'Отчет.xlsx';
  await saveFile({
    fileId,
    fileName,
    fileData: await template.result(),
  });
  return new FileViewer({
    fileId,
    fileName,
  });
}
