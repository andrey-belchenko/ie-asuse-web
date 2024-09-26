
import type { NavigatorItem } from "./Folder";
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
   
  }
}
