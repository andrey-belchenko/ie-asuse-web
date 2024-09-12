import type { DataSource } from "./DataSource";
import type { NavigatorItem } from "./Folder";
import type { Form } from "./Form";
import { RegularReport } from "./reports/RegularReport";
import { ConfigItem } from './ConfigItem';

export interface NavigatorProps {
  name: string;
  items: NavigatorItem[];
}

export class Navigator  extends ConfigItem {
  name: string;
  items: NavigatorItem[];
  constructor(props: NavigatorProps) {
    super();
    this.name = props.name;
    this.items = props.items;
    this.setIds(this.name)
  }
}
