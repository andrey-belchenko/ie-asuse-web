import * as fs from 'fs/promises';
import * as xml2js from 'xml2js';
import { promisify } from 'util';
import * as path from 'path';
// import * as _ from 'lodash';
import { JSONPath } from 'jsonpath-plus';
import { saveTextAsFile } from '@/mongo';

const parseString = promisify(xml2js.parseString);

async function processXML() {
  const folder =
    'C:\\Repos\\mygithub\\ie-asuse-web\\reports-api\\src\\reports\\config\\reports\\rep_24557';
  // Read XML file from disk
  const data = await fs.readFile(path.join(folder, 'template1.frx'), 'utf-8');

  // Parse XML data to JS object
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

  //   console.log(result)

  //   let all = _.flatMapDeep(result);

  //   let dict = _.filter(_.flattenDeep(result), (obj: any) => obj.Dictionary)[0].Dictionary;
  //   let conElements = _.filter(_.flatten(dict), (obj: any) => obj.PostgresDataConnection);

  //   let dict = _.filter(_.flatMapDeep(result), (obj: any) => obj.Dictionary)[0];
  //   let conElements = _.filter(_.flatMapDeep(dict), (obj: any) => obj.PostgresDataConnection);

  // Change the JS object
  // For example, let's change the value of a hypothetical 'name' property
  // result.root.name[0] = 'New Name';

  // Convert JS object back to XML
  const builder = new xml2js.Builder();
  const xml = builder.buildObject(xObj);

  let fileId = await saveTextAsFile(xml, 'template.xml');

  console.log(fileId)

  // Save XML back to disk
//   await fs.writeFile(path.join(folder, 'template1_p.frx'), xml);

  //   await fs.writeFile(
  //     path.join(folder, 'template1.json'),
  //     JSON.stringify(result),
  //   );

//   console.log('XML file has been saved!');
}

processXML();
