import { uploadFile } from '@/features/reports/services/pgsql';
import { ExcelTemplate } from '@/features/reports/services/ExcelTemplate';
import { DataSet } from '@/features/reports/types/DataSet';
import { Context } from '@/features/reports/types/reports/RegularReport';
import { FileViewer } from '@/features/reports/types/views/FileViewer';
import * as _ from 'lodash';
import * as moment from 'moment';
import * as path from 'path';

export default async function (context: Context, data: DataSet) {
  let columns = data['columns'];

  let groupedColumns = _(columns)
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

  let rows = _(data['main'])
    .map((it) => ({
      договор_id: it.договор_id,
      договор_номер: it.договор_номер,
      абонент_имя: it.абонент_имя,
      отделение_имя: it.отделение_имя,
      участок_имя: it.участок_имя,
      ику_рсо_имя: it.ику_рсо_имя,
      гр_потр_нас_имя: it.гр_потр_нас_имя,
      год: it.год,
      период_id: it.период_id,
      месяц_имя: it.месяц_имя,
      месяц: it.месяц,
      долг: it.долг,
    }))
    .value();

  type GroupingTreeItem<T> = { props: T; items?: GroupingTree<T> };

  type GroupingTree<T> = GroupingTreeItem<T>[];

  type GroupNextFunction<T> = (rows: T[]) => GroupingTree<T>;

  type GroupingFunction<T> = (
    rows: T[],
    keyExpr: (row: T) => any,
    groupNext?: GroupNextFunction<T>,
  ) => GroupingTree<T>;

  // let group: GroupingFunction = (
  //   rows,
  //   keyExpr,
  //   groupChildren?: GroupNextFunction,
  // ) => {
  //   let result = _(rows)
  //     .groupBy((row) => keyExpr(row))
  //     .map((groupItems) => ({
  //       props: groupItems[0],
  //       items: groupChildren ? groupChildren(groupItems) : undefined,
  //     }))
  //     .value();
  //   return result;
  // };

  function group<T, TSum>(
    rows: T[],
    keyExpr: (row: T) => any,
    summaryExpr?: (rows: T[]) => TSum,
    groupNext?: GroupNextFunction<T>,
  ) {
    let result = _(rows)
      .groupBy((row) => keyExpr(row))
      .map((groupRows) => ({
        props: groupRows[0],
        summary: summaryExpr ? summaryExpr(groupRows) : ({} as TSum),
        items: groupNext
          ? groupNext(groupRows)
          : groupRows.map((it) => ({ props: it })),
      }))
      .value();
    return result;
  }

  let deps = group(
    rows,
    (row) => row.отделение_имя,
    (rows) => ({
      долг: _(rows).sumBy((it) => it.долг),
    }),
    (rows) => group(rows, (row) => row.ику_рсо_имя),
  );

  // let grouped = _(rows)
  //   .groupBy((it) => it.отделение_имя)
  //   .map((it) => ({
  //     props: { ...it[0], долг: _(it).sumBy((sit) => sit.долг) },
  //     items: _(it)
  //       .groupBy((it) => it.ику_рсо_имя)
  //       .map((it) => ({
  //         props: { ...it[0], долг: _(it).sumBy((sit) => sit.долг) },
  //         items: it,
  //       }))
  //       .value(),
  //   }))
  //   .value();

  let template = new ExcelTemplate();
  await template.loadFile(path.join(path.dirname(__filename), 'template.xlsx'));
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
        range.loop(
          1,
          1,
          () =>
            _(colsInGroup)
              .filter((it) => it.месяц_имя)
              .value(),
          (range, item) => {
            range.setValue(0, 2, `${item.месяц_имя} \r ${item.год} года`);
          },
        );
      },
    );
  });

  await template.mapRows((range) => {
    range.setValue(
      2,
      3,
      `Просроченная задолженность на ${moment(context.formValues.date).format('DD.MM.YYYY')} года , в т.ч.`,
    );
    range.loop(
      4,
      5,
      () => deps,
      (range, dep) => {
        range.setValue(0, 2, `Итого по ${dep.props.отделение_имя}`);
        range.setValue(0, 3, dep.summary.долг);
        range.loop(1, 4, dep.items, (range, item) => {
          range.setValue(
            0,
            2,
            `Итого ${item.props.ику_рсо_имя} по ${item.props.отделение_имя}`,
          );
          // range.setValue(0, 3, item.props.долг);
        });
      },
    );
  });

  let fileId = 'test';
  let fileName = 'Отчет.xlsx';
  await uploadFile({
    fileId,
    fileName,
    fileData: await template.result(),
  });
  return new FileViewer({
    fileId,
    fileName,
  });
}
