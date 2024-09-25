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

async function copySheetCellByCell(
  sourceSheetName: string,
  targetSheetName: string,
) {
  const workbook = new ExcelJS.Workbook();
  let srcPath = path.join(path.dirname(__filename), '24557.xlsx');
  let trgPath = path.join(path.dirname(__filename), '24557-result.xlsx');
  await workbook.xlsx.readFile(srcPath);

  const sourceSheet = workbook.getWorksheet(sourceSheetName);
  const targetSheet = workbook.addWorksheet(targetSheetName);

  let rows: ExcelJS.Row[] = [];
  sourceSheet.eachRow({ includeEmpty: true }, (row, rowNumber) => {
    rows.push(row);
  });

  let rowIndex = 0;

  let shift = 0;
  while (rowIndex < rows.length) {
    let row = rows[rowIndex];
    row.eachCell({ includeEmpty: true }, (cell, colNumber) => {
      let newCell = targetSheet.getCell(rowIndex + 1, colNumber);
      if (cell.type == ExcelJS.ValueType.SharedString) {
        newCell.value = cell.text;
      } else if (cell.type == ExcelJS.ValueType.Formula) {
        let translatedFormula = translateFormula(cell.formula, 0, shift);
        newCell.value = { formula: translatedFormula };
      } else {
        newCell.value = cell.value;
      }
      newCell.style = cell.style;
      newCell.numFmt = cell.numFmt;
    });
    rowIndex+=1;
  }


  // Copy column widths
  sourceSheet.columns.forEach((column, index) => {
    let trgCol = targetSheet.getColumn(index + 1);
    trgCol.hidden = column.hidden;
    trgCol.width = column.width;
  });

  //   sourceSheet.eachRow((row, rowNumber) => {
  //     targetSheet.getRow(rowNumber).height = row.height;
  //   });

  let merges = sourceSheet['_merges'];

  for (let name in merges) {
    targetSheet.mergeCells(merges[name]);
  }

  //   .forEach((merge: any) => {
  //     targetSheet.mergeCells(merge);
  //   });

  await workbook.xlsx.writeFile(trgPath);
  console.log('done');
}

copySheetCellByCell('2.10.', '2.10.-copy');
