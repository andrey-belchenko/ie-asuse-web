import { DataSet } from '@/features/reports/types/DataSet';
import { Context } from '@/features/reports/types/reports/RegularReport';
import { ReportTable } from '@/features/reports/types/views/ReportTable';
import { Column } from 'devextreme/ui/data_grid';
import * as _ from 'lodash';
export default async function (context: Context, data: DataSet) {
  let numColumnOptions: Column = {
    dataType: 'number',
    format: {
      type: 'fixedPoint',
      precision: 2,
    },
  };

  let columns: Column[] = [
    {
      caption: 'Номер договора',
      dataField: 'договор_номер',
    },
    {
      caption: 'Наименование абонента',
      dataField: 'абонент_имя',
    },
    {
      caption: 'Отделение',
      dataField: 'отделение_имя',
    },
    {
      caption: 'ИКУ/РСО',
      dataField: 'ику_рсо_имя',
    },
    {
      caption: 'Участок',
      dataField: 'участок_имя',
    },
    {
      caption: 'ИКУ/РСО',
      dataField: 'гр_потр_нас_имя',
      dataType: 'number',
    },
    {
      caption: 'Просроченная задолженность на начало периода',
      dataField: 'долг',
      ...numColumnOptions,
    },
  ];

  let summaries = [];

  const addSummary = (columnName: string) => {
    summaries.push({
      column: columnName,
      summaryType: 'sum',
      valueFormat: {
        type: 'fixedPoint',
        precision: 2,
      },
      displayFormat: '{0}',
    });
  };

  addSummary('долг');
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
    .groupBy((it) => (it.месяц ? it.год : it.период_id))
    .values()
    .sortBy((it) => it[0].column_id)
    .value();

  for (let bandInfoColumns of bandsInfos) {
    let firstColInfo = bandInfoColumns[0];
    if (bandInfoColumns.length == 1) {
      columns.push({
        caption: firstColInfo.период_имя,
        dataField: firstColInfo.name,
        ...numColumnOptions,
      });
      addSummary(firstColInfo.name);
    } else {
      let band: Column = {
        caption: firstColInfo.период_имя + ' (по периодам)',
        columns: [],
      };
      for (let columnInfo of bandInfoColumns) {
        band.columns.push({
          caption: columnInfo.месяц_имя + ' ' + columnInfo.год,
          dataField: columnInfo.name,
          ...numColumnOptions,
        });
        addSummary(columnInfo.name);
      }
      columns.push(band);
    }
  }
  return new ReportTable({
    sourceTableName: 'main',
    columns: columns,
    summary: { totalItems: summaries },
  });
}
