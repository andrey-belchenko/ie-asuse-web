import type { Column,Summary } from "devextreme/ui/data_grid";
import { ReportView, type ReportViewProps } from "../ReportView";


export interface ReportTableProps extends ReportViewProps {
  columns?: Column[];
  summary?: Summary;
}

export class ReportTable extends ReportView {
  columns?: Column[];
  summary?: Summary;
  constructor(props: ReportTableProps) {
    super(props);
    this.columns = props.columns;
    this.summary = props.summary;
  }
}
