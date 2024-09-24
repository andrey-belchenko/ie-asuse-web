import { remoteMethodCall } from "@/api-client/config";
import { ConfigItem } from "../types/ConfigItem";
import { Executor } from "../types/Executor";
import { MethodParams } from "../types/MethodParams";

export class RemoteExecutor extends Executor {
  constructor() {
    super();
  }

  override async methodCallHandler(
    configItem: ConfigItem,
    method: string,
    params?: MethodParams
  ) {
    return await remoteMethodCall(configItem.id, method, params);
  }
}
