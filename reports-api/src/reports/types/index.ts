import { editors } from './editors';
import { reports } from './reports';
import { views } from './views';
import { DataSource } from './DataSource';
import { Field } from './Field';
import { Folder } from './Folder';
import { Form } from './Form';
import { Navigator } from './Navigator';


function toDict(arr) {
  return arr.reduce((acc, curr) => {
    acc[curr.name] = curr;
    return acc;
  }, {});
}

export const registry: Function[] = {
  ...toDict([
    ...editors,
    ...views,
    ...reports,
    DataSource,
    Field,
    Folder,
    Form,
    Navigator,
  ]),
};
