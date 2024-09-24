import type { Form } from '../Form';
import { Report, type ReportProps } from '../Report';
import type { ReportView } from '../ReportView';
import { ReportTable } from '../views/ReportTable';
import { Executor } from '../Executor';
import { MethodParams } from '../MethodParams';
import { ReportExecResult } from '../ReportExecResult';

export interface RegularReportProps extends ReportProps {
  paramsForm?: Form;
  // dataSource?: DataSource;
  dataSource?: (formValues: any) => Promise<any[]>;
  view?: ReportView;
}

export class RegularReport extends Report {
  paramsForm?: () => Promise<Form>;
  // dataSource?: DataSource;
  dataSource?: (formValues: any) => Promise<any[]>;
  execute?: (params: MethodParams) => Promise<ReportExecResult>;

  view: ReportView;
  constructor(props: RegularReportProps) {
    super(props);
    this.paramsForm = async () => props.paramsForm;
    this.dataSource = props.dataSource;
    this.view = props.view ?? new ReportTable({});
    this.execute = async (params: MethodParams) => {
      let data = await this.dataSource(params.formValues);
      let tempId = this.id;
      await Executor.getInstance().putDataToTemp(data, tempId);
      return new ReportExecResult({
        tempId: tempId,
        view: this.view,
      });
    };
  }
}
