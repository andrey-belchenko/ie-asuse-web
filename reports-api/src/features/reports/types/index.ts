// TODO: переделать в виде класса

import editors from './editors';
import reports from './reports';
import views from './views';
import { Field } from './Field';
import { Folder } from './Folder';
import { Form } from './Form';
import { Navigator } from './Navigator';
import { Executor } from './Executor';
import { ReportExecResult } from './ReportExecResult';

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
    Field,
    Folder,
    Form,
    Navigator,
    ReportExecResult,
  ]),
};

function isObject(value) {
  return value && typeof value === 'object' && value.constructor === Object;
}

function isArray(value) {
  return Array.isArray(value);
}

function instantiateValue(value: any): any {
  if (isObject(value)) {
    return instantiate(value);
  } else if (isArray(value)) {
    let newValue = [];
    for (let item of value) {
      newValue.push(instantiateValue(item));
    }
    return newValue;
  }
  return value;
}

// Для использования на клиенте, чтобы на основе JSON полученного с сервера создать объекты нужных классов (через new...)
export function instantiate<T>(object: T): T {
  if (!object) {
    return undefined as T;
  }
  let obj = object as any;

  if (!obj.className) {
    return object;
  }

  const className: string = obj.className;
  if (obj.className == object.constructor.name) {
    return object;
  }

  let buffObj: any = {};

  for (let fieldName in obj) {
    buffObj[fieldName] = instantiateValue(obj[fieldName]);
  }

  const newObj = new registry[className](buffObj);
  newObj.id = buffObj.id;
  for (let methodName of obj.methodNames) {
    newObj[methodName] = async (params?: any) => {
      // реализация методов на клиенте подменяется на запрос к серверу с выполнением соотв. метода на сервере.
      return await Executor.getInstance().methodCallHandler(
        newObj,
        methodName,
        params,
      );
    };
  }
  return newObj;
}

// type PrepareTemplateFunc = (
//   filePath: string,
//   templateId: string,
// ) => Promise<void>;
// export var prepareTemplate: PrepareTemplateFunc = async () => {};
// export function setPrepareTemplateFunc(func: PrepareTemplateFunc) {
//   prepareTemplate = func;
// }
