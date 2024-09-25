import * as ExcelJS from 'exceljs';
// import {Row}  from 'exceljs';
import * as path from 'path';

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

function createMap(loops, sourceCount) {
  let map = [];
  createMapLevel(loops, sourceCount, map, 0, 0);
  return map;
}

function createMapLevel(
  loops,
  sourceCount,
  map: any[],
  targetIndex,
  sourceOffset,
) {
  let sourceIndex = 0;
  while (sourceIndex < sourceCount) {
    let loop = loops[sourceIndex];
    if (loop) {
      for (let iteration = 0; iteration < loop.iterations; iteration++) {
        targetIndex = createMapLevel(
          loop.loops,
          loop.length,
          map,
          targetIndex,
          sourceIndex + sourceOffset,
        );
      }
      sourceIndex += loop.length;
    } else {
      map.push({
        trgIndex: targetIndex,
        srcIndex: sourceIndex + sourceOffset,
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
  loops: any,
) {
  let rows: ExcelJS.Row[] = [];
  sourceSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    rows.push(row);
  });

  let map = createMap(loops, rows.length);
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
  loops: any,
) {
  let columns: ExcelJS.Column[] = [];
  sourceSheet.columns.forEach((column, index) => {
    columns.push(sourceSheet.getColumn(index + 1));
  });
  let map = createMap(loops, columns.length);
  for (let mapItem of map) {
    let column = columns[mapItem.srcIndex];
    let offset = mapItem.trgIndex - mapItem.srcIndex;
    column.eachCell({ includeEmpty: true }, (cell, rowNumber) => {
      let newCell = targetSheet.getCell(rowNumber, mapItem.trgIndex + 1);
      if (cell.type == ExcelJS.ValueType.SharedString) {
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

async function copySheetCellByCell(sourceSheetName: string) {
  const workbook = new ExcelJS.Workbook();
  let srcPath = path.join(path.dirname(__filename), '24557.xlsx');
  let trgPath = path.join(path.dirname(__filename), '24557-result.xlsx');
  await workbook.xlsx.readFile(srcPath);

  const sourceSheet = workbook.getWorksheet(sourceSheetName);
  const targetSheet1 = workbook.addWorksheet(sourceSheetName + '-1');
  const targetSheet2 = workbook.addWorksheet(sourceSheetName + '-2');

  let rowLoops = {
    4: {
      from: 4,
      length: 5,
      iterations: 3,
      // loops: {},
      loops: {
        1: {
          from: 1,
          length: 4,
          iterations: 2,
          loops: {},
        },
      },
    },
  };

  // let rowLoops = {};

  let columnLoops = {
    5: {
      from: 5,
      length: 2,
      iterations: 3,
      // loops: {},
      loops: {
        1: {
          from: 1,
          length: 1,
          iterations: 12,
          loops: {},
        },
      },
    },
  };
  // let columnLoops = {};
  


  processColumns(sourceSheet, targetSheet1, columnLoops);
  processRows(targetSheet1, targetSheet2, rowLoops);

  //   sourceSheet.eachRow((row, rowNumber) => {
  //     targetSheet.getRow(rowNumber).height = row.height;
  //   });

  // let merges = sourceSheet['_merges'];

  // for (let name in merges) {
  //   targetSheet.mergeCells(merges[name]);
  // }

  //   .forEach((merge: any) => {
  //     targetSheet.mergeCells(merge);
  //   });

  await workbook.xlsx.writeFile(trgPath);
  console.log('done');
}

copySheetCellByCell('2.10.');
