// import { convertAndSaveFrTemplate } from '@/template';
import { ReportView, type ReportViewProps } from '../ReportView';
// import { prepareTemplate } from '..';

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
      // await prepareTemplate(this.templatePath, templateId);
    };
  }
}
