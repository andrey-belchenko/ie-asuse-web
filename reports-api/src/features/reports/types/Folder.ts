import type { Report } from "./Report";
import { ConfigItem } from './ConfigItem';

export type NavigatorItem = Folder | Report;

export interface FolderProps {
  title: string;
  items: NavigatorItem[];
}

export class Folder  extends ConfigItem  {
  title: string;
  items: NavigatorItem[];
  constructor(props: FolderProps) {
    super();
    this.title = props.title;
    this.items = props.items;
  }
}
