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

  type MyObj = { someField: string };

  type GroupingTreeItem<T> = { props: T; items?: GroupingTree<T> };

  type GroupingTree<T> = GroupingTreeItem<T>[];

  type GroupNextFunction = <T>(rows: T[]) => GroupingTree<T>;

  type GroupingFunction = <T>(
    rows: T[],
    columnName: string,
    groupNext?: GroupNextFunction,
  ) => GroupingTree<T>;

  let group: GroupingFunction = (
    rows,
    columnName,
    groupChildren?: GroupNextFunction,
  ) => {
    let result = _(rows)
      .groupBy((row) => row[columnName])
      .map((groupItems) => ({
        props: groupItems[0],
        items: groupChildren ? groupChildren(groupItems) : undefined,
      }))
      .value();
    return result;
  };

  // type ItemProcessor<T> = {
  //   items: T[];
  //   process: (item: T) => void;
  //   childItemProcessor?: ItemProcessor<any>[];
  // };

  // type Item =  {name:string, details:Detail[]}
  // type Detail = {value:number};

  // const items:Item[] = [
  //   {
  //     name: 'item1',
  //     details: [
  //       {
  //         value: 1,
  //       },
  //       {
  //         value: 2,
  //       },
  //     ],
  //   },
  //   {
  //     name: 'item2',
  //     details: [
  //       {
  //         value: 3,
  //       },
  //       {
  //         value: 4,
  //       },
  //     ],
  //   },
  // ];
  // group(rows,"отделение_имя", (rows)=> )

  // function group<T>(rows: T[], columnName: string) {
  //   return _(rows)
  //     .groupBy((it) => it[columnName])
  //     .map((it) => ({
  //       props: it[0],
  //       items: it,
  //     }))
  //     .value();
  // }

  let grouped1 = group(rows, 'отделение_имя', (rows) =>
    group(rows, 'ику_рсо_имя'),
  );

  let grouped = _(rows)
    .groupBy((it) => it.отделение_имя)
    .map((it) => ({
      props: { ...it[0], долг: _(it).sumBy((sit) => sit.долг) },
      items: _(it)
        .groupBy((it) => it.ику_рсо_имя)
        .map((it) => ({
          props: { ...it[0], долг: _(it).sumBy((sit) => sit.долг) },
          items: it,
        }))
        .value(),
    }))
    .value();

  let template = new ExcelTemplate();
  await template.loadFile(path.join(path.dirname(__filename), 'template.xlsx'));
  await template.mapColumns([
    {
      from: 4,
      length: 2,
      items: async () => groupedColumns,
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
            range.setValue(0, 2, `${item.месяц_имя} \r ${item.год} года`);
          },
        },
      ],
    },
  ]);

  await template.mapRows([
    {
      from: 0,
      length: 10,
      items: async () => [{}],
      apply: async (range) => {
        range.setValue(
          2,
          3,
          `Просроченная задолженность на ${moment(context.formValues.date).format('DD.MM.YYYY')} года , в т.ч.`,
        );
      },
      loops: [
        {
          from: 4,
          length: 5,
          items: async () => grouped1,
          apply: async (range, item) => {
            range.setValue(0, 2, `Итого по ${item.props.отделение_имя}`);
            // range.setValue(0, 3, item.props.долг);
          },
          loops: [
            {
              from: 1,
              length: 4,
              items: async (parentItem) => parentItem.items,
              apply: async (range, item) => {
                range.setValue(
                  0,
                  2,
                  `Итого ${item.props.ику_рсо_имя} по ${item.props.отделение_имя}`,
                );
                // range.setValue(0, 3, item.props.долг);
              },
            },
          ],
        },
      ],
    },
  ]);

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
