import nav10 from "../config/navigators/nav10";
import { Folder, type NavigatorItem } from "../types/Folder";

const navigator = nav10;

export type TreeItem = {
  data: NavigatorItem;
  id: number;
  parentId?: number;
  title: string;
  expanded: boolean;
  icon?: string;
};

export function getTreeItems() {
  const treeItems: TreeItem[] = [];
  let id = 0;
  const getNext = (items: NavigatorItem[], parentId?: number) => {
    for (let item of items) {
      id++;
      const treeItem: TreeItem = {
        id: id,
        data: item,
        title: item.title,
        expanded: true,
      };
      if (parentId) {
        treeItem.parentId = parentId;
      }
      treeItems.push(treeItem);
      if (item instanceof Folder) {
        getNext(item.items, id);
      } else {
        treeItem.icon = "file";
      }
    }
  };
  getNext(navigator.items);
  return treeItems;
}
