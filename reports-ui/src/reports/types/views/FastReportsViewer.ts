import { ReportView, type ReportViewProps } from "../ReportView";

export interface FastReportsViewerProps extends ReportViewProps {
  templateName: String;
}

export class FastReportsViewer extends ReportView {
  templateName: String;
  constructor(props: FastReportsViewerProps) {
    super(props);
    this.templateName = props.templateName;
  }
}
