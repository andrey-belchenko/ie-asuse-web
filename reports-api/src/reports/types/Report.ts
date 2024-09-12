import { ConfigItem } from './ConfigItem';

export interface ReportProps {
  title: string;
}

export class Report  extends ConfigItem {
  title: string;
  constructor(props: ReportProps) {
    super();
    this.title = props.title;
  }
}