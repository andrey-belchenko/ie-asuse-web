import { StoredFile, uploadFile } from '@/features/reports/services/pgsql';
import { Executor } from '../Executor';
import { ReportView, type ReportViewProps } from '../ReportView';

export interface FileViewerProps extends ReportViewProps {
  fileName: string;
  fileId: string;
}

export class FileViewer extends ReportView {
  fileName: string;
  fileId: string;
  constructor(props: FileViewerProps) {
    super(props);
    this.fileName = props.fileName;
    this.fileId = props.fileId;
  }
}
