
import { Report, type ReportProps } from "../Report";

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
