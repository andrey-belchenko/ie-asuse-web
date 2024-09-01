

export interface ReportProps {
  title: string;
}

export class Report {
  title: string;
  constructor(props: ReportProps) {
    this.title = props.title;
  }
}