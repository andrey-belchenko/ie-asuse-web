import * as path from 'path';
import { convertAndSaveFrTemplate } from '@/template';


async function processXML() {
  const folder =
    'C:\\Repos\\mygithub\\ie-asuse-web\\reports-api\\src\\reports\\config\\reports\\rep_24557';
  await convertAndSaveFrTemplate(path.join(folder, 'template1.frx'),"template");
  console.log('XML file has been saved!');
}

processXML();
