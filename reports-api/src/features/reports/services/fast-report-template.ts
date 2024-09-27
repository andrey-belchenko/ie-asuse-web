import * as fs from 'fs/promises';
import * as xml2js from 'xml2js';
import { promisify } from 'util';
import { JSONPath } from 'jsonpath-plus';
import { uploadFastReportTemplate } from '@/features/reports/services/pgsql';
import { convertPath } from './path';
const parseString = promisify(xml2js.parseString);

export async function convertAndSaveFrTemplate(
  filePath: string,
  templateId: string,
) {
  filePath = convertPath(filePath);
  const data = await fs.readFile(filePath, 'utf-8');
  const xObj = await parseString(data);
  const xDict = xObj.Report.Dictionary[0];
  if (xDict?.PostgresDataConnection) {
    for (let xCon of xDict.PostgresDataConnection) {
      if (xCon.TableDataSource) {
        for (let xTbl of xCon.TableDataSource) {
          delete xTbl.$.SelectCommand;
          const xRefs = JSONPath({
            path: `$..[?(@.DataSource=="${xTbl.$.Name}")]`,
            json: xObj,
          });
          for (let ref of xRefs) {
            ref.DataSource = xTbl.$.Alias;
          }
          xTbl.$.Name = xTbl.$.Alias;
          xTbl.$.ReferenceName = xTbl.$.Alias;
          if (!xDict.TableDataSource) {
            xDict.TableDataSource = [];
          }

          xDict.TableDataSource.push(xTbl);
        }
      }
    }
    delete xDict.PostgresDataConnection;
  }
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(xObj);
  const fileData = Buffer.from(xml, 'utf-8');
  await uploadFastReportTemplate(templateId, fileData);
}
