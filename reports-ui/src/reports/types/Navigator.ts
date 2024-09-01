import type { DataSource } from "./DataSource";
import type { NavigatorItem } from "./Folder";
import type { Form } from "./Form";
import { RegularReport } from "./reports/RegularReport";

export interface NavigatorProps {
  items: NavigatorItem[];
}

export class Navigator {
  items: NavigatorItem[];
  constructor(props: NavigatorProps) {
    this.items = props.items;
  }
}
