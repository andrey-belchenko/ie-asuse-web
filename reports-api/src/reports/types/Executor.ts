import { ConfigItem } from './ConfigItem';
import { MethodParams } from './MethodParams';

export class Executor {
  private static instance?: Executor;
  constructor() {}

  static setInstance(instance: Executor) {
    Executor.instance = instance;
  }

  static getInstance(): Executor {
    if (!Executor.instance) {
      Executor.instance = new Executor();
    }
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

  async putDataToTemp(data: any[], tempTableName: string, tableName?: string) {}
}
