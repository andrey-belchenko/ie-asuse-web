<template>
    <div class="main">
        <DxTreeView id="treeview" :items="treeItems" :search-enabled="true" parent-id-expr="parentId" key-expr="id"
            data-structure="plain" display-expr="title" @item-click="selectItem" :focus-state-enabled="false"
            :select-by-click="true" selection-mode="single" />
    </div>

</template>


<script src="./ReportList.ts"  lang="ts"></script>

<style scoped>
.main {
    /* margin: 0px 3px 0px 3px; */
    position: absolute;
    inset: 0;
}
</style>