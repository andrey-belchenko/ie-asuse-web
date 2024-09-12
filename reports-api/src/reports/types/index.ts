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

const registry: Function[] = {
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

export function instantiate<T>(object: T): T {
  if (!object) {
    return;
  }
  const obj = object as any;
  const className: string = obj.className;
  if (obj.className == object.constructor.name) {
    return object;
  }
  const newObj = new registry[className](object);
  for (let methodName of obj.methodNames) {
    newObj[methodName] = () => true;
  }
  return newObj;
}
