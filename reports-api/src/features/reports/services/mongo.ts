import * as mongoDB from 'mongodb';

import { MongoClient, GridFSBucket, ObjectId } from 'mongodb';
import { DataSet } from '../types/DataSet';

require('babel-polyfill');
const query = require('devextreme-query-mongodb');
// const mongoDbUrl = 'mongodb://root:dpt-dev@dpt.dpt-dev.oastu.lan:27017';
const mongoDbUrl = 'mongodb://127.0.0.1:27017/';
const dbName = 'bav_test_report';

console.log(`mongoDbUrl: ${mongoDbUrl}`);

export function replaceDateStrings(obj: any) {
  // Check if the input is an object
  if (typeof obj === 'object' && obj !== null) {
    // Iterate over each key-value pair in the object
    for (let key in obj) {
      // Check if the value is a string
      if (typeof obj[key] === 'string') {
        // Check if the string matches the date format
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(obj[key])) {
          // Replace the string with a Date object
          obj[key] = new Date(obj[key]);
        }
      }
      // Check if the value is an object or an array
      else if (typeof obj[key] === 'object' && obj[key] !== null) {
        // Recursively call the function for nested objects or arrays
        replaceDateStrings(obj[key]);
      }
    }
  }
  return obj;
}

export async function execQuery(req: any): Promise<any> {
  // log(req)
  console.log('Request');
  console.log(JSON.stringify(req.loadOptions));
  let results = undefined;
  await useMongo(async (client: mongoDB.MongoClient) => {
    const db = client.db(dbName);
    const collection = db.collection(req.collection);
    let loadOptions = replaceDateStrings(req.loadOptions);
    results = await query(collection, loadOptions);
    console.log('Response');
    // console.log(JSON.stringify(results));
  });
  return results;
}

async function useMongo(
  operations: (client: mongoDB.MongoClient) => Promise<void>,
) {
  let client: mongoDB.MongoClient;
  try {
    client = new mongoDB.MongoClient(mongoDbUrl);
    await client.connect();
    await operations(client);
  } finally {
    try {
      client.close();
    } catch {}
  }
}

export async function putDataToTemp(
  data: DataSet,
  tempId: string,
): Promise<void> {
  await useMongo(async (client: mongoDB.MongoClient) => {
    const db = client.db(dbName);
    const dsInfoCollection = db.collection(tempId + ':info');
    await dsInfoCollection.deleteMany();
    if (Array.isArray(data)) {
      await dsInfoCollection.insertOne({ multiple: false });
      let collection = db.collection(tempId);
      await collection.deleteMany();
      await collection.insertMany(data);
    } else {
      let info: any = { multiple: true, tables: {} };
      for (let name in data) {
        info.tables[name] = true;
        let collection = db.collection(tempId + `.${name}`);
        await collection.deleteMany();
        await collection.insertMany(data[name]);
      }
      await dsInfoCollection.insertOne(info);
    }
  });
}

export async function getDataSetFromTemp(tempId: string): Promise<DataSet> {
  let data: DataSet = [];
  await useMongo(async (client: mongoDB.MongoClient) => {
    const db = client.db(dbName);
    const dsInfoCollection = db.collection(tempId + ':info');
    let info = await dsInfoCollection.findOne();
    if (info?.multiple) {
      data = {};
      for (let name in info.tables) {
        const collection = db.collection(tempId + `.${name}`);
        const cursor = await collection.find();
        data[name] = await cursor.toArray();
      }
    } else {
      const collection = db.collection(tempId);
      const cursor = await collection.find();
      data = await cursor.toArray();
    }
  });
  return data;
}

// export async function saveTextAsFile(content: string, fileName: string) {
//   const fileId = new ObjectId();
//   await useMongo(async (client: mongoDB.MongoClient) => {
//     const db = client.db(dbName);
//     const bucket = new GridFSBucket(db);
//     const uploadStream = bucket.openUploadStreamWithId(fileId, fileName);
//     await new Promise((resolve, reject) => {
//       uploadStream.end(content, 'utf8', () => {
//         resolve(null);
//       });
//     });
//   });
//   return fileId.toString();
// }
