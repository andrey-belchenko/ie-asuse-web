// import { Sequelize, QueryTypes, Options } from 'sequelize';

// const options: Options = {
//   username: 'asuse',
//   password: 'kl0pik',
//   database: 'asuse',
//   host: 'asuse-ai-dev.infoenergo.loc',
//   port: 5432,
//   dialect: 'postgres',
// };

// const sequelize = new Sequelize(options);

// export const execFunction = async (functionName: string, params: any) => {
//   const results = await sequelize.query(
//     // "select * from report_util.get_оборотная_ведомость('2021-03-01','2021-03-31',ARRAY [1210,1172]) limit 1",
//     "select cast(123.12 as decimal) as value",
//     { type: QueryTypes.SELECT },
//   );

//   return results;
// };

import { Pool, types } from 'pg';
import { replaceDateStrings } from './mongo';

types.setTypeParser(1700, 'text', parseFloat);

const pool = new Pool({
  connectionString: `postgres://asuse:kl0pik@asuse-ai-dev.infoenergo.loc:5432/asuse`,
});

export const execFunction = async (functionName: string, params: any) => {
  const client = await pool.connect();
  try {
    params = replaceDateStrings(params);
    let paramsStr = '';
    let q = '';
    let i = 0;
    const paramsArray = [];
    for (let name in params) {
      i++;
      let value = params[name];
      paramsStr += q + name + ' => ' + '$' + i;
      q = ', ';
      paramsArray.push(value);
    }
    // const res = await client.query("select * from report_util.get_оборотная_ведомость('2021-03-01','2021-03-31',ARRAY [1210,1172])");
    const query = `select * from ${functionName}(${paramsStr})`;
    const res = await client.query(query, paramsArray);
    return res.rows as any[];
  } finally {
    client.release();
  }
};

export const query = async (sql: string, params?: any[]) => {
  const client = await pool.connect();
  try {
    const res = await client.query(sql, params);
    return res.rows as any[];
  } finally {
    client.release();
  }
};

export const queryTable = async (tableName: string) => {
  const client = await pool.connect();
  try {
    const query = `select * from ${tableName}`;
    const res = await client.query(query);
    return res.rows as any[];
  } finally {
    client.release();
  }
};

export const uploadFastReportTemplate = async (
  templateId: string,
  fileData: Buffer,
) => {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO report_sys.template (template_id, file_data) VALUES ($1, $2)
       ON CONFLICT (template_id) DO UPDATE SET file_data = $2`,
      [templateId, fileData],
    );
  } finally {
    client.release();
  }
};

export interface StoredFile {
  fileId: string;
  fileName: string;
  fileData: Buffer;
}

export const saveFile = async (file: StoredFile) => {
  const client = await pool.connect();
  try {
    await client.query(
      `INSERT INTO report_sys.file (file_id, file_name, file_data) VALUES ($1, $2, $3)
       ON CONFLICT (file_id) DO UPDATE SET file_name=$2, file_data = $3`,
      [file.fileId, file.fileName, file.fileData],
    );
  } finally {
    client.release();
  }
};

export const downloadFile = async (
  fileId: string,
): Promise<StoredFile | null> => {
  const client = await pool.connect();
  try {
    const result = await client.query(
      `SELECT file_id, file_name, file_data FROM report_sys.file WHERE file_id = $1`,
      [fileId],
    );

    if (result.rows.length > 0) {
      const row = result.rows[0];
      return {
        fileId: row.file_id,
        fileName: row.file_name,
        fileData: row.file_data,
      };
    } else {
      return null;
    }
  } finally {
    client.release();
  }
};
