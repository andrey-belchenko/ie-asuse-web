
import { Folder, type NavigatorItem } from "../types/Folder";
import { defineComponent, onMounted, ref } from "vue";
import DxTreeView from "devextreme-vue/tree-view";
import { getNavigatorConfig } from "@/features/reports/services/api-client/config";

export default defineComponent({
  components: {
    DxTreeView
  },
  setup(_, { emit }) {
  
    // const treeItems = ref(getTreeItems());
    const treeItems = ref<TreeItem[]>([]);
    function selectItem({ itemData }: { itemData: TreeItem }) {
      emit("report-select", itemData.data);
    }

    const fetchData = async () => {
      treeItems.value = await getTreeItems();
    };

    onMounted(fetchData);
    return {
      treeItems,
      selectItem,
    };
  },
});

// const navigator = nav10;

export type TreeItem = {
  data: NavigatorItem;
  id: number;
  parentId?: number;
  title: string;
  expanded: boolean;
  icon?: string;
};

async function getTreeItems() {
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
  let navigator = await getNavigatorConfig()
  getNext(navigator.items);
  return treeItems;
}
