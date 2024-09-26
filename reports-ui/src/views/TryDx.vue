<template>
  <DxDataGrid
    :data-source="dataSource"
    :show-borders="true"
    :remote-operations="true"
  >
  </DxDataGrid>
</template>
<script setup lang="ts">
import {
  DxDataGrid, DxColumn, DxPaging, DxPager,
} from 'devextreme-vue/data-grid';

import { createDataSource } from "../reports/services/api-client/mongo.js";
const dataSource = createDataSource({
      // database: "bav_sample",
      collectionName: "financial_facts"
    })
</script>
