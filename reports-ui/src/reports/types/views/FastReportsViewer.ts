import { convertAndSaveFrTemplate } from '@/template';
import { ReportView, type ReportViewProps } from '../ReportView';
import { Executor } from '../Executor';
// import { prepareTemplate } from '..';

export interface FastReportsViewerProps extends ReportViewProps {
  templatePath: string;
}

export class FastReportsViewer extends ReportView {
  templatePath: string;
  prepareTemplate: () => Promise<void>;
  constructor(props: FastReportsViewerProps) {
    super(props);
    this.templatePath = props.templatePath;
    this.prepareTemplate = async () => {
        await Executor.getInstance().prepareTemplate(this.templatePath, this.id)
    };
  }
}
