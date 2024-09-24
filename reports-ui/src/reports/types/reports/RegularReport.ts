
import type { Form } from '../Form';
import { Report, type ReportProps } from '../Report';
import type { ReportView } from '../ReportView';
import { ReportTable } from '../views/ReportTable';
import { Executor } from '../Executor';

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
  async fillDataSet(formValues: any) {
    let data = await this.dataSource(formValues);
    let tempTaleName = this.id;
    await Executor.getInstance().putDataToTemp(data, tempTaleName);
    return tempTaleName;
  }
  view: ReportView;
  constructor(props: RegularReportProps) {
    super(props);
    this.paramsForm = async () => props.paramsForm;
    this.dataSource = props.dataSource;
    this.view = props.view ?? new ReportTable({});
    // const data = await execFunction(request.functionName, request.params);
    // await putDataToTemp(data, request.tempTableName);
  }
}
