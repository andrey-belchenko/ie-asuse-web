import { instantiate } from "@/reports/types";
import { Navigator } from "@/reports/types/Navigator";
export interface ExecFunctionParams {
  tempTableName: string;
  functionName: string;
  params?: any;
}

const baseUrl = "http://localhost:3000";

export const getNavigatorConfig = async () => {
  const response = await fetch(`${baseUrl}/reports-config`, {
    method: "GET",
    headers: {
      "Content-Type": "application/json",
    },
  });
  const body = await response.json();

  return instantiate<Navigator>(body);
};

export const execFunction = async (params: ExecFunctionParams) => {
  const response = await fetch(`${baseUrl}/call`, {
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
  const response = await fetch(`${baseUrl}/query-table`, {
    method: "POST",
    body: JSON.stringify(params || {}),
    headers: {
      "Content-Type": "application/json",
    },
  });

  const body = await response.json();

  return body["data"] as any[];
};
