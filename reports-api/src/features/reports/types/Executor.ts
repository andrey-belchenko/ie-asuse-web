import { ConfigItem } from './ConfigItem';
import { DataSet } from './DataSet';
import { MethodParams } from './MethodParams';

// Класс содержит методы для вызова из объектов конфигурации, те методы для которых реализация на сервере и на клиенте отличается
export class Executor {
  private static instance?: Executor;
  constructor() {}

  static setInstance(instance: Executor) {
    Executor.instance = instance;
  }

  static getInstance(): Executor {
    return Executor.instance;
  }

  async methodCallHandler(
    configItem: ConfigItem,
    method: string,
    params?: MethodParams,
  ) {
    return undefined as any;
  }

  async prepareTemplate(filePath: string, templateId: string) {}

  async putDataToTemp(data: DataSet, tempId: string) {}

  async getDataSetFromTemp(tempId: string) {
    return [] as DataSet;
  }
}
