import { convertAndSaveFrTemplate } from '@/features/reports/services/fast-report-template';
import { Executor } from '../types/Executor';
import { getDataSetFromTemp, putDataToTemp } from '@/features/reports/services/mongo';
import { DataSet } from '../types/DataSet';

export class ServerExecutor extends Executor {
  constructor() {
    super();
  }

  override async prepareTemplate(filePath: string, templateId: string) {
    await convertAndSaveFrTemplate(filePath, templateId);
  }

  override async putDataToTemp(data: DataSet, tempId: string) {
    await putDataToTemp(data, tempId);
  }

  override async getDataSetFromTemp(tempId: string) {
    return await getDataSetFromTemp(tempId);
  }
}
