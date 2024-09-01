import { execFunction, queryTable } from "@/api-client/pg";
import type { RegularReport } from "../../types/reports/RegularReport";
import notify from "devextreme/ui/notify";

export interface RunReportResult {
  tempTableName: string;
}

export async function runReport(
  reportConfig: RegularReport,
  params: any
): Promise<RunReportResult> {
  const tempTableName = "report_temp";
  const funcPars = reportConfig.dataSource!.getFuncParams(params);
  await execFunction({
    tempTableName: tempTableName,
    functionName: reportConfig.dataSource!.functionName,
    params: funcPars,
  });
  return { tempTableName: tempTableName };
}
