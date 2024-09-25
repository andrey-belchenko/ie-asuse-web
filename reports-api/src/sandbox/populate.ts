import * as XlsxPopulate from 'xlsx-populate';
import * as path from 'path';
async function copySheet(
  sourceSheetName: string,
  targetSheetName: string,
) {
  let srcPath = path.join(path.dirname(__filename), '24557.xlsx');
  let trgPath = path.join(path.dirname(__filename), '24557-result.xlsx');
  // Load the workbook.
  const workbook = await XlsxPopulate.fromFileAsync(srcPath);

  // Get the source sheet.
  const sourceSheet = workbook.sheet(sourceSheetName);

  // Check if source sheet exists.
  if (!sourceSheet) {
    throw new Error(`Sheet ${sourceSheetName} does not exist.`);
  }

  // Create a new sheet with the target name.
  const targetSheet = workbook.addSheet(targetSheetName);

  // Get the used range in the source sheet.
  const usedRange = sourceSheet.usedRange();

  // Copy the values from the source sheet to the target sheet.
  usedRange.value().forEach((row, rowIndex) => {
    row.forEach((value, columnIndex) => {

      targetSheet.cell(rowIndex + 1, columnIndex + 1).value(value);
    });
  });

  // Write to file.
  await workbook.toFileAsync(trgPath);
  console.log("done");
}

copySheet('2.10.', '2.10.-copy')