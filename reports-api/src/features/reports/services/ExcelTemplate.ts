import { convertPath } from '@/features/reports/services/path';
import * as ExcelJS from 'exceljs';

// export interface ExcelTemplateProps {
//   templatePath: string;
// }

export class ExcelTemplate {
  private workbook?: ExcelJS.Workbook;
  private currentSheet?: ExcelJS.Worksheet;
  private sheetName?: string;
  async loadFile(templatePath: string) {
    this.workbook = new ExcelJS.Workbook();
    await this.workbook.xlsx.readFile(convertPath(templatePath));
    this.currentSheet = this.workbook.getWorksheet(1);
    this.sheetName = this.currentSheet.name;
  }

  async mapRows<T>(loops: Loop[]) {
    const newSheet = this.workbook.addWorksheet();
    await processRows(this.currentSheet, newSheet, loops);
    this.currentSheet = newSheet;
  }

  async mapRows1<T>(apply: ApplyRootFunc<T>) {
    const range = new Range();
    range.loop(0, this.currentSheet.lastRow.number, async () => [{}], apply);
    const newSheet = this.workbook.addWorksheet();
    await processRows(this.currentSheet, newSheet, range.loops);
    this.currentSheet = newSheet;
  }

  async mapColumns(loops: Loop[]) {
    const newSheet = this.workbook.addWorksheet();
    await processColumns(this.currentSheet, newSheet, loops);
    this.currentSheet = newSheet;
  }

  async result() {
    [...this.workbook.worksheets].forEach((sheet) => {
      if (sheet.id != this.currentSheet.id) {
        this.workbook.removeWorksheet(sheet.id);
      }
    });
    this.currentSheet.name = this.sheetName;
    // let workbook = new ExcelJS.Workbook();
    // let sheet = workbook.addWorksheet(this.sheetName);
    // await processRows(this.currentSheet, sheet, []);
    // sheet.model = this.currentSheet.model;
    // let excelBuffer = await workbook.xlsx.writeBuffer();
    let excelBuffer = await this.workbook.xlsx.writeBuffer();
    return Buffer.from(excelBuffer);
  }
}

type ItemsFunc<T> = (parentItem?: T, parentIndex?: number) => Promise<T[]>;
type ApplyItemFunc<T> = (range: Range, item: T, index: any) => Promise<void>;
type ApplyRootFunc<T> = (range: Range) => Promise<void>;

type Loop = {
  from: number;
  length: number;
  items: ItemsFunc<any>;
  apply?: ApplyItemFunc<any>;
  // loops?: Loop[];
};

type LoopProps<T> = {
  from: number;
  length: number;
  items: ItemsFunc<T>;
  apply?: ApplyItemFunc<T>;
};

type CellsValues = { [key: number]: any };
type RangeValues = { [key: number]: CellsValues };

// export interface RangeSettingProps {
//   start: number;
//   size: number;
// }
// export class RangeSetting {
//   values: RangeValues = {};
//   start: number;
//   size: number;
//   constructor(props: RangeSettingProps) {
//     this.start = props.start;
//     this.size = props.size;
//   }
// }

export class Range {
  values: RangeValues = {};
  loops: Loop[] = [];
  constructor() {}
  setValue(directIndex: number, crossIndex: number, value: any) {
    if (!this.values[directIndex]) {
      this.values[directIndex] = {};
    }
    this.values[directIndex][crossIndex] = value;
  }
  loop<T>(
    from: number,
    length: number,
    items: ItemsFunc<T>,
    apply?: ApplyItemFunc<T>,
  ) {
    this.loops.push({
      from: from,
      length: length,
      items: items,
      apply: apply,
    });
  }
}

interface MapItem {
  trgIndex: number;
  srcIndex: number;
  values: CellsValues;
}

async function createMap(loops: Loop[], sourceCount) {
  let map: MapItem[] = [];
  await createMapLevel(loops, sourceCount, map, 0, 0);
  return map;
}

async function createMapLevel(
  loops: Loop[],
  sourceCount: number,
  map: MapItem[],
  targetIndex: number,
  sourceOffset: number,
  item?: any,
  rangeValues?: RangeValues,
) {
  let loopsDict = loops.reduce((obj, item) => {
    obj[item.from] = item;
    return obj;
  }, {});
  let sourceIndex = 0;
  while (sourceIndex < sourceCount) {
    let loop: Loop = loopsDict[sourceIndex];
    if (loop) {
      let childItems = await loop.items(item);
      let childIndex = 0;
      for (let childItem of childItems) {
        let range = new Range();
        if (loop.apply) {
          await loop.apply(range, childItem, childIndex);
        }
        targetIndex = await createMapLevel(
          // loop.loops || [],
          range.loops,
          loop.length,
          map,
          targetIndex,
          sourceIndex + sourceOffset,
          childItem,
          range.values,
        );
        childIndex++;
      }
      sourceIndex += loop.length;
    } else {
      let values = {};
      if (rangeValues) {
        if (rangeValues[sourceIndex]) {
          values = rangeValues[sourceIndex];
        }
      }
      map.push({
        trgIndex: targetIndex,
        srcIndex: sourceIndex + sourceOffset,
        values: values,
      });
      targetIndex++;
      sourceIndex++;
    }
  }
  return targetIndex;
}

async function processRows(
  sourceSheet: ExcelJS.Worksheet,
  targetSheet: ExcelJS.Worksheet,
  loops: Loop[],
) {
  let rows: ExcelJS.Row[] = [];
  sourceSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    rows.push(row);
  });

  let map = await createMap(loops, rows.length);
  for (let mapItem of map) {
    let row = rows[mapItem.srcIndex];
    let offset = mapItem.trgIndex - mapItem.srcIndex;
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      let newCell = targetSheet.getCell(mapItem.trgIndex + 1, colNumber);
      let values = mapItem.values;
      if (values[colNumber - 1]) {
        newCell.value = values[colNumber - 1];
      } else if (cell.type == ExcelJS.ValueType.SharedString) {
        newCell.value = cell.text;
      } else if (cell.type == ExcelJS.ValueType.Formula) {
        let translatedFormula = translateFormula(cell.formula, 0, offset);
        newCell.value = { formula: translatedFormula };
      } else {
        newCell.value = cell.value;
      }
      newCell.style = cell.style;
      newCell.numFmt = cell.numFmt;
    });
    let trgRow = targetSheet.getRow(mapItem.trgIndex + 1);
    trgRow.hidden = row.hidden;
    trgRow.height = row.height;
  }

  sourceSheet.columns.forEach((column, index) => {
    let trgCol = targetSheet.getColumn(index + 1);
    trgCol.hidden = column.hidden;
    trgCol.width = column.width;
  });
}

async function processColumns(
  sourceSheet: ExcelJS.Worksheet,
  targetSheet: ExcelJS.Worksheet,
  loops: Loop[],
) {
  let columns: ExcelJS.Column[] = [];
  sourceSheet.columns.forEach((column, index) => {
    columns.push(sourceSheet.getColumn(index + 1));
  });
  let map = await createMap(loops, columns.length);

  for (let mapItem of map) {
    let values: CellsValues = mapItem.values;
    let column = columns[mapItem.srcIndex];
    let offset = mapItem.trgIndex - mapItem.srcIndex;
    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      let newCell = targetSheet.getCell(rowNumber, mapItem.trgIndex + 1);
      if (values[rowNumber - 1]) {
        newCell.value = values[rowNumber - 1];
      } else if (cell.type == ExcelJS.ValueType.SharedString) {
        newCell.value = cell.text;
      } else if (cell.type == ExcelJS.ValueType.Formula) {
        let translatedFormula = translateFormula(cell.formula, offset, 0);
        newCell.value = { formula: translatedFormula };
      } else {
        newCell.value = cell.value;
      }
      newCell.style = cell.style;
      newCell.numFmt = cell.numFmt;
    });
    let trgCol = targetSheet.getColumn(mapItem.trgIndex + 1);
    trgCol.hidden = column.hidden;
    trgCol.width = column.width;
  }

  sourceSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    let trgRow = targetSheet.getRow(rowNumber);
    trgRow.hidden = row.hidden;
    trgRow.height = row.height;
  });
}

function translateFormula(
  formula: string,
  columnOffset: number,
  rowOffset: number,
): string {
  if (rowOffset == 0 && columnOffset == 0) return formula;
  return formula.replace(/([A-Z]+)(\d+)/g, (match, column, row) => {
    // Convert column from letters to number (A -> 1, B -> 2, etc.)
    let columnNumber = 0;
    for (let i = 0; i < column.length; i++) {
      columnNumber =
        columnNumber * 26 + column.charCodeAt(i) - 'A'.charCodeAt(0) + 1;
    }

    // Apply offset and convert back to letters
    columnNumber += columnOffset;
    let newColumn = '';
    while (columnNumber > 0) {
      newColumn =
        String.fromCharCode(((columnNumber - 1) % 26) + 'A'.charCodeAt(0)) +
        newColumn;
      columnNumber = Math.floor((columnNumber - 1) / 26);
    }

    // Apply row offset
    let newRow = parseInt(row) + rowOffset;
    return newColumn + newRow;
  });
}
