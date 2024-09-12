import { ConfigItem } from './ConfigItem';
export interface DataSourceProps {
  functionName: string;
  paramsBinding?: any;
}

export class DataSource  extends ConfigItem {
  functionName: string;
  paramsBinding?: any;
  constructor(props: DataSourceProps) {
    super();
    this.functionName = props.functionName;
    this.paramsBinding = props.paramsBinding;
  }

  getFuncParams = (formParams: any): any => {
    const funcPars: any = {};
    for (let name in this.paramsBinding) {
      funcPars[name] = formParams[this.paramsBinding[name]];
    }
    return funcPars;
  };
}
