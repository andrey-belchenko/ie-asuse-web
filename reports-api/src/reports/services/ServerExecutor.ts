

import { Executor } from "../types/Executor";

export class ServerExecutor extends Executor {
  constructor() {
    super();
  }

  public override prepareTemplate: (
    filePath: string,
    templateId: string,
  ) => Promise<void> = async () => {};
}