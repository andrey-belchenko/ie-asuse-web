import { convertAndSaveFrTemplate } from '@/template';
import { Executor } from '../types/Executor';
import { putDataToTemp } from '@/mongo';

export class ServerExecutor extends Executor {
  constructor() {
    super();
  }

  override async prepareTemplate(filePath: string, templateId: string) {
    convertAndSaveFrTemplate(filePath, templateId);
  }

  override async putDataToTemp(
    data: any[],
    tempTableName: string,
    tableName?: string,
  ) {
    await putDataToTemp(data, tempTableName, tableName);
  }
}
