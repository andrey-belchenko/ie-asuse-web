<template>
    <div class="main">
        <DxTreeView id="treeview" :items="treeItems" :search-enabled="true" parent-id-expr="parentId" key-expr="id"
            data-structure="plain" display-expr="title" @item-click="selectItem" :focus-state-enabled="false"
            :select-by-click="true" selection-mode="single" />
    </div>

</template>
<script setup lang="ts">
import { ref } from 'vue';
import DxTreeView from 'devextreme-vue/tree-view'
import { getTreeItems, type TreeItem } from './ReportList';
import type { NavigatorItem } from '../types/Folder';
const treeItems = ref(getTreeItems());
const emit = defineEmits<{
    (event: 'report-select', value: NavigatorItem): void
}>()
function selectItem({ itemData }: { itemData: TreeItem }) {
    emit('report-select', itemData.data);
}

</script>

<style scoped>
.main {
    margin: 0px 3px 0px 3px;
}
</style>