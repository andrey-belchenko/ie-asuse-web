import { instantiate, setMethodCallHandler } from "@/reports/types";
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
  setMethodCallHandler(async (configItem, method, params) => {
    return await remoteMethodCall(configItem.id, method, params);
  });

  return instantiate<Navigator>(body);
};

const remoteMethodCall = async (
  itemId: string,
  methodName: string,
  params: any
) => {
  debugger;
  const response = await fetch(
    `${baseUrl}/config-items/${itemId}/methods/${methodName}/call`,
    {
      method: "POST",
      body: JSON.stringify(params || {}),
      headers: {
        "Content-Type": "application/json",
      },
    }
  );
  const body = await response.json();
  return instantiate(replaceDateStrings(body).data);
};

function replaceDateStrings(obj: any) {
  // Check if the input is an object
  if (typeof obj === "object" && obj !== null) {
    // Iterate over each key-value pair in the object
    for (let key in obj) {
      // Check if the value is a string
      if (typeof obj[key] === "string") {
        // Check if the string matches the date format
        if (/^\d{4}-\d{2}-\d{2}T\d{2}:\d{2}:\d{2}\.\d{3}Z$/.test(obj[key])) {
          // Replace the string with a Date object
          obj[key] = new Date(obj[key]);
        }
      }
      // Check if the value is an object or an array
      else if (typeof obj[key] === "object" && obj[key] !== null) {
        // Recursively call the function for nested objects or arrays
        replaceDateStrings(obj[key]);
      }
    }
  }
  return obj;
}
