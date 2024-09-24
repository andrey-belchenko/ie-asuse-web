import { ConfigItem } from './ConfigItem';
import { ReportView } from './ReportView';

export interface ReportExecResultProps {
  tempId: any;
  view: ReportView;
}

export class ReportExecResult extends ConfigItem {
  tempId: any;
  view: ReportView;
  constructor(props: ReportExecResultProps) {
    super();
    this.tempId = props.tempId;
    this.view = props.view;
  }
}
