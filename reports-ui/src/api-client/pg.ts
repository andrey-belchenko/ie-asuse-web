export interface ExecFunctionParams {
  tempTableName: string;
  functionName: string;
  params?: any;
}

export const execFunction = async (params: ExecFunctionParams) => {
  const response = await fetch("http://localhost:3000/call", {
    method: "POST",
    body: JSON.stringify(params || {}),
    headers: {
      "Content-Type": "application/json",
    },
  });
};

export interface QueryTableParams {
  tableName: string;
}

export const queryTable = async (params: QueryTableParams) => {
  const response = await fetch("http://localhost:3000/query-table", {
    method: "POST",
    body: JSON.stringify(params || {}),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();

  return body["data"] as any[];
};
