import { ReportView, type ReportViewProps } from '../ReportView';
import * as ExcelJS from 'exceljs';

export interface ExcelViewerProps extends ReportViewProps {
  templatePath: string;
}

export class ExcelViewer extends ReportView {
  templatePath: string;
  mappings: Mapping[] = [];
  mapRows(loops: Loop[]) {
    this.mappings.push({
      direction: MappingDirection.rows,
      loops: loops,
    });
  }
  mapColumns(loops: Loop[]) {
    this.mappings.push({
      direction: MappingDirection.columns,
      loops: loops,
    });
  }
  constructor(props: ExcelViewerProps) {
    super(props);
    this.templatePath = props.templatePath;
  }
}

interface Mapping {
  direction: MappingDirection;
  loops: Loop[];
}

enum MappingDirection {
  rows,
  columns,
}

type ItemsFunc = (parentItem?: any, parentIndex?: number) => Promise<any[]>;
type ApplyItemFunc = (range: Range, item: any, index: any) => Promise<void>;

interface Loop {
  from: number;
  length: number;
  items: ItemsFunc;
  apply?: ApplyItemFunc;
  loops?: Loop[];
}

type CellsValues = { [key: number]: any };
type RangeValues = { [key: number]: CellsValues };
export class Range {
  constructor() {}
  values: RangeValues = {};
  setValue(directIndex: number, crossIndex: number, value: any) {
    if (!this.values[directIndex]) {
      this.values[directIndex] = {};
    }
    this.values[directIndex][crossIndex] = value;
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
    let loop = loopsDict[sourceIndex];
    if (loop) {
      let childItems = await loop.items(item);
      let childIndex = 0;
      for (let childItem of childItems) {
        let range = new Range();
        if (loop.apply) {
          await loop.apply(range, childItem, childIndex);
        }
        targetIndex = await createMapLevel(
          loop.loops || [],
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
      if (cell.type == ExcelJS.ValueType.SharedString) {
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
