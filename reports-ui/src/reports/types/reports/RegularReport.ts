import type { DataSource } from "../DataSource";
import type { Form } from "../Form";
import { Report, type ReportProps } from "../Report";
import type { ReportView } from "../ReportView";
import { ReportTable } from "../views/ReportTable";

export interface RegularReportProps extends ReportProps {
  paramsForm?: Form;
  dataSource?: DataSource;
  view?: ReportView;
}

export class RegularReport extends Report {

  paramsForm?:  () => Promise<Form>;
  dataSource?: DataSource;
  view: ReportView;
  constructor(props: RegularReportProps) {
    super(props);
    this.paramsForm = async ()=> props.paramsForm;
    this.dataSource = props.dataSource;
    this.view = props.view ?? new ReportTable({});
  }
}
