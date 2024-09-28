import * as _ from 'lodash';

export type GroupingTreeItem<T> = { props: T; summary: T; items?: GroupingTree<T> };

export type GroupingTree<T> = GroupingTreeItem<T>[];

export function grouping<T>(rows: T[], keys: (row: T) => any[]): GroupingTree<T> {
  if (rows.length == 0) {
    return [];
  }
  const rowsWithKey = rows.map((row) => ({ props: row, keys: keys(row) }));
  const levelsCount = rowsWithKey[0].keys.length;
  const numericColumnsDict: any = {};
  for (let row of rows) {
    for (let name in row) {
      if (numericColumnsDict[name] !== false) {
        let value = row[name];
        if (typeof value === 'number') {
          numericColumnsDict[name] = true;
        } else if (value) {
          numericColumnsDict[name] = false;
        }
      }
    }
  }
  const numericColumns = [];
  for (let name in numericColumnsDict) {
    if (numericColumnsDict[name]) {
      numericColumns.push(name);
    }
  }
  const groupNext = (rows: any[], level: number) => {
    let result = _(rows)
      .groupBy((row) => row.keys[level])
      .map((groupRows) => {
        let items: GroupingTree<T> = undefined;
        if (level < levelsCount) {
          items = groupNext(groupRows, level + 1);
        } else {
          items = groupRows.map((row) => ({
            props: row.props,
            summary: row.props,
            items: [],
          }));
        }
        let summary: any = {};
        for (let name of numericColumns) {
          summary[name] = _(items).sumBy((row) => row.summary[name]);
        }
        return {
          props: groupRows[0].props,
          summary: summary,
          items: items,
        };
      })
      .value();
    return result;
  };
  const result = groupNext(rowsWithKey, 0);
  return result;
}
