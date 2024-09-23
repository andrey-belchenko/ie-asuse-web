// TODO: переделать в виде класса

import { editors } from './editors';
import { reports } from './reports';
import { views } from './views';
import { DataSource } from './DataSource';
import { Field } from './Field';
import { Folder } from './Folder';
import { Form } from './Form';
import { Navigator } from './Navigator';
import type { ConfigItem } from './ConfigItem';
import { MethodParams } from './MethodParams';
import { Executor } from './Executor';

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
      return await Executor.getInstance().methodCallHandler(newObj,methodName,params);
    };
  }
  return newObj;
}

// type MethodCallHandler = (
//   configItem: ConfigItem,
//   method: string,
//   params?: MethodParams,
// ) => Promise<any>;

// // let methodCallHandler: MethodCallHandler = () => new Date(2022, 2, 31);
// let methodCallHandler: MethodCallHandler = async () => undefined;

// export function setMethodCallHandler(func: MethodCallHandler) {
//   methodCallHandler = func;
// }

// type PrepareTemplateFunc = (
//   filePath: string,
//   templateId: string,
// ) => Promise<void>;
// export var prepareTemplate: PrepareTemplateFunc = async () => {};
// export function setPrepareTemplateFunc(func: PrepareTemplateFunc) {
//   prepareTemplate = func;
// }
