import { MethodParams } from "./MethodParams"

export type Method = AsyncMethod | SyncMethod

type AsyncMethod = (params?: MethodParams) => Promise<any>
type SyncMethod = (params?: MethodParams) => any