import { remoteMethodCall } from "@/api-client/config";
import { ConfigItem } from "../types/ConfigItem";
import { Executor } from "../types/Executor";
import { MethodParams } from "../types/MethodParams";

export class RemoteExecutor extends Executor {
  constructor() {
    super();
  }

  public override methodCallHandler: (
    configItem: ConfigItem,
    method: string,
    params?: MethodParams
  ) => Promise<any> = async (configItem, method, params) => {
    return await remoteMethodCall(configItem.id, method, params);
  };
}
