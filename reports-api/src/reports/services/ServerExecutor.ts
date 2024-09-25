import { convertAndSaveFrTemplate } from '@/fastReportTemplate';
import { Executor } from '../types/Executor';
import { putDataToTemp } from '@/mongo';
import { DataSet } from '../types/DataSet';

export class ServerExecutor extends Executor {
  constructor() {
    super();
  }

  override async prepareTemplate(filePath: string, templateId: string) {
    convertAndSaveFrTemplate(filePath, templateId);
  }

  override async putDataToTemp(
    data: DataSet,
    tempTableName: string,
  ) {
    await putDataToTemp(data, tempTableName);
  }
}
