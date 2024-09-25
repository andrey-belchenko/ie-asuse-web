import * as XLSX from 'xlsx';
import * as path from 'path';

function copySheet(
  sourceSheetName: string,
  targetSheetName: string,
) {
  let srcPath = path.join(path.dirname(__filename), '24557.xlsx');
  let trgPath = path.join(path.dirname(__filename), '24557-result.xlsx');
  // Read the source workbook
  const sourceWorkbook = XLSX.readFile(srcPath);

  // Get the source sheet
  // const sourceSheet = sourceWorkbook.Sheets[sourceSheetName];

  // // Create a new workbook for the target file
  // // const targetWorkbook = XLSX.utils.book_new();

  // // Convert the source sheet to JSON
  // const sourceSheetJson = XLSX.utils.sheet_to_json(sourceSheet, { header: 1 });

  // // Convert the JSON back to a worksheet
  // const targetSheet = XLSX.utils.json_to_sheet(sourceSheetJson);

  // // Append the worksheet to the new workbook
  // XLSX.utils.book_append_sheet(sourceWorkbook, targetSheet, targetSheetName);

  // Write the new workbook to the target file
  XLSX.writeFile(sourceWorkbook, trgPath);
  console.log("done");
}

copySheet('2.10.', '2.10.-copy');