import { execFunction } from '@/pgsql';
import * as _ from 'lodash';

export default async (formValues: any) => {
  let data = await load(formValues);
  return prepare(data);
};

async function load(formValues: any) {
  return await execFunction('report_util.get_rep_24557', {
    p_дата: formValues.date,
    p_отделение_id: formValues.dep,
    p_участок_id: formValues.uchastok,
  });
}

function prepare(data: any[]) {
  data = _(data)
    .map((it) => ({
      ...it,
      период_id: it.период_id + 5, //в БД -4..0 переводим в положительные
    }))
    .map((it) => ({
      ...it,
      column_id: 1e2 * it.период_id + (it.месяц || 0),
    }))
    .value();

  let columns = _(data)
    .map((it) => ({
      column_id: it.column_id,
      период_id: it.период_id,
      период_имя: it.период_имя,
      год: it.год,
      месяц_имя: it.месяц_имя,
      месяц: it.месяц,
    }))
    .uniqBy((it) => it.column_id)
    .sortBy((it) => it.column_id)
    .value();

  let detailColumns = _(columns)
    .filter((it) => it.год)
    .value();

  let summaryColumns = _(columns)
    .uniqBy((it) => it.год)
    .map((it) => ({
      column_id: 1e2 * it.период_id,
      период_id: it.период_id,
      период_имя: it.период_имя,
      год: it.год,
      месяц: null,
    }))
    .value();

  let allColumns = _([...summaryColumns, ...detailColumns])
    .sortBy((it) => it.column_id)
    .value();

  // console.log(JSON.stringify(allColumns, null, 3));
  const result = _(data)
    .map((it) => ({
      props: {
        договор_id: it.договор_id,
        договор_номер: it.договор_номер,
        абонент_имя: it.абонент_имя,
        отделение_имя: it.отделение_имя,
        участок_имя: it.участок_имя,
        ику_рсо_имя: it.ику_рсо_имя,
        гр_потр_нас_имя: it.гр_потр_нас_имя,
      },
      год: it.год,
      период_id: it.период_id,
      месяц_имя: it.месяц_имя,
      месяц: it.месяц,
      долг: it.долг,
    }))
    .filter((it) => it.долг != 0)
    .groupBy((it) => it.props.договор_id)
    .map((items) => {
      let item = items[0];
      let row = {
        ...item.props,
        долг: _(items).sumBy((it) => it.долг),
      };

      for (let column of allColumns) {
        let value = _(items)
          .filter(
            (it) =>
              it.период_id == column.период_id &&
              it.месяц == (column.месяц || it.месяц),
          )
          .sumBy((it) => it.долг);
        let columnName = `долг_${column.column_id}`;
        row[columnName] = value || 0;
      }
      return row;
    })
    .value();

  return result;
  // console.log(JSON.stringify(result[0], null, 3));
}
