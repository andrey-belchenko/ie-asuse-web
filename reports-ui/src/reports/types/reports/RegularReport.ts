import type { Form } from '../Form';
import { Report, type ReportProps } from '../Report';
import { ReportView } from '../ReportView';
import { ReportTable } from '../views/ReportTable';
import { Executor } from '../Executor';
import { MethodParams } from '../MethodParams';
import { ReportExecResult } from '../ReportExecResult';
import { DataSet } from '../DataSet';

type Context = MethodParams;
type ViewPostProcessFunc = (
  context: Context,
  data: DataSet,
) => Promise<ReportView>;
export interface RegularReportProps extends ReportProps {
  paramsForm?: Form;
  dataSource?: (formValues: any) => Promise<any[]>;
  view?: ReportView | ViewPostProcessFunc;
}

export class RegularReport extends Report {
  paramsForm?: () => Promise<Form>;
  getData?: (formValues: any) => Promise<DataSet>;
  execute?: (params: MethodParams) => Promise<ReportExecResult>;
  getView?: ViewPostProcessFunc;
  constructor(props: RegularReportProps) {
    super(props);
    this.paramsForm = async () => props.paramsForm;
    this.getData = props.dataSource;
    if (props.view instanceof ReportView) {
      this.getView = async () => {
        return props.view as ReportView;
      };
    } else if (typeof props.view == 'function') {
      this.getView = props.view;
    }
    this.execute = async (params: MethodParams) => {
      let data = await this.getData(params.formValues);
      let tempId = this.id;
      await Executor.getInstance().putDataToTemp(data, tempId);
      let view = await this.getView(params, data);
      return new ReportExecResult({
        tempId: tempId,
        view: view,
      });
    };
  }
}
