import { ConfigItem } from './ConfigItem';
import { MethodParams } from './MethodParams';

export class Executor {
  private static instance?: Executor;
  constructor() {
  }

  public static setInstance(instance: Executor) {
    Executor.instance = instance;
  }

  public static getInstance(): Executor {
    if (!Executor.instance) {
      Executor.instance = new Executor();
    }
    return Executor.instance;
  }

  public methodCallHandler: (
    configItem: ConfigItem,
    method: string,
    params?: MethodParams,
  ) => Promise<any> = async () => undefined;
}
