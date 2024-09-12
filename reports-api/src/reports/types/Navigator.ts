import type { DataSource } from "./DataSource";
import type { NavigatorItem } from "./Folder";
import type { Form } from "./Form";
import { RegularReport } from "./reports/RegularReport";
import { ConfigItem } from './ConfigItem';

export interface NavigatorProps {
  items: NavigatorItem[];
}

export class Navigator  extends ConfigItem {
  items: NavigatorItem[];
  constructor(props: NavigatorProps) {
    super();
    this.items = props.items;
  }
}
