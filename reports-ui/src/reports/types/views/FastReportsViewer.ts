// import { convertAndSaveFrTemplate } from '@/template';
import { ReportView, type ReportViewProps } from '../ReportView';

export interface FastReportsViewerProps extends ReportViewProps {
  templatePath: string;
}

export class FastReportsViewer extends ReportView {
  templatePath: string;
  prepareTemplate: (templateId: string) => Promise<void>;
  constructor(props: FastReportsViewerProps) {
    super(props);
    this.templatePath = props.templatePath;
    this.prepareTemplate = async (templateId) => {
      // await convertAndSaveFrTemplate(this.templatePath, templateId);
    };
  }
}
