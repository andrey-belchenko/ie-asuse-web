import { Sequelize } from "sequelize";
import options from "../config";
import { DbObject } from "../classes/DbObject";

const sequelize = new Sequelize(options);

export const createObject = async (dbObject: DbObject) => {
  await sequelize.query(dbObject.createSql());
};

export const deleteObject = async (dbObject: DbObject) => {
  await sequelize.query(dbObject.deleteSql());
};

export const resetObjects = async (dbObjects: DbObject[]) => {
  for (let item of dbObjects) {
    await deleteObject(item);
  }

  let objectsToCreate = collectDependantAndSelf(dbObjects);
  let createQueue = new Array<DbObject>();

  let iteration = 0;
  while (objectsToCreate.size > 0) {
    let currentObjForCreate = new Set(objectsToCreate);
    for (let obj of currentObjForCreate) {
      if (isReadyForCreation(obj, objectsToCreate)) {
        createQueue.push(obj);
        objectsToCreate.delete(obj);
      }
    }
    iteration += 1;
    if (iteration > 100) {
      let names = Array.from(objectsToCreate).map(obj => obj.fileName).join(', ');
      throw new Error("Can't resolve creation order for " + names);
    }
  }
  for (let obj of createQueue) {
    await createObject(obj);
  }
};

const collectDependantAndSelf = (dbObjects: DbObject[]): Set<DbObject> => {
  let all = new Set<DbObject>();
  for (let obj of dbObjects) {
    all.add(obj);
    let decedents = collectDependantAndSelf(obj.dependent);
    for (let decedent of decedents) {
      all.add(decedent);
    }
  }
  return all;
};

const isReadyForCreation = (
  dbObject: DbObject,
  objectsToCreate: Set<DbObject>
): boolean => {
  for (let parent of dbObject.dependsOn) {
    if (objectsToCreate.has(parent)) {
      return false;
    }
  }
  return true;
};
