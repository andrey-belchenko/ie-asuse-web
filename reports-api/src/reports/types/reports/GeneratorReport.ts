import type { DataSource } from "../DataSource";
import type { Form } from "../Form";
import { Report, type ReportProps } from "../Report";
import type { ReportView } from "../ReportView";
import { ReportTable } from "../views/ReportTable";

export interface GeneratorReportProps extends ReportProps {
  reportId: string;
}

export class GeneratorReport extends Report {
  reportId: string;
  constructor(props: GeneratorReportProps) {
    super(props);
    this.reportId = props.reportId;
  }
}
