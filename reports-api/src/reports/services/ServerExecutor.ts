import { convertAndSaveFrTemplate } from '@/fastReportTemplate';
import { Executor } from '../types/Executor';
import { getDataSetFromTemp, putDataToTemp } from '@/mongo';
import { DataSet } from '../types/DataSet';

export class ServerExecutor extends Executor {
  constructor() {
    super();
  }

  override async prepareTemplate(filePath: string, templateId: string) {
    convertAndSaveFrTemplate(filePath, templateId);
  }

  override async putDataToTemp(data: DataSet, tempId: string) {
    await putDataToTemp(data, tempId);
  }

  override async getDataSetFromTemp(tempId: string) {
    return await getDataSetFromTemp(tempId);
  }
}
