<template>
    <div class="rep-table">
        <DxPivotGrid id="sales" :allow-sorting-by-summary="true" :allow-sorting="true" :allow-filtering="true"
            :allow-expand-all="true" :height="440" :show-borders="true" :data-source="dataSource">
          
        </DxPivotGrid>
    </div>
</template>
<script setup lang="ts">
import DxPivotGrid, {
    DxFieldChooser,
} from 'devextreme-vue/pivot-grid';
import PivotGridDataSource from 'devextreme/ui/pivot_grid/data_source';
import { sales } from './data';
// import { createDataSource } from "../../api-client/query/query.js";

import { createDataSource } from "@/reports/services/api-client/mongo";
const dataStore = createDataSource({
    //   database: "bav_sample",
      collectionName: "financial_facts"
    })

const dataSource = new PivotGridDataSource({
    // "company": random.choice(companies),
    //     "product_type": random.choice(product_types),
    //     "revenue": random.randint(1, 100) * 1000,
    //     "expenses": random.randint(1, 100) * 500,
    //     "date": datetime.now()
    fields: [
        {
            caption: 'company',
            dataField: 'company',
            area: 'row',
        },
        {
            caption: 'product_type',
            dataField: 'product_type',
            area: 'row',
        },
        {
            dataField: 'date',
            dataType: 'date',
            area: 'column',
        },
        {
            caption: 'revenue',
            dataField: 'revenue',
            dataType: 'number',
            summaryType: 'sum',
            format: 'currency',
            area: 'data',
        },
        {
            caption: 'expenses',
            dataField: 'expenses',
            dataType: 'number',
            summaryType: 'sum',
            format: 'currency',
            area: 'data',
        },
    ],
    remoteOperations: true,
    store: dataStore,
});


</script>
<style>
.rep-table {
    position: absolute;
    inset: 0;

}

.rep-table>.dx-widget {
    position: absolute;
    inset: 0;
}

.rep-table td[role=columnheader] {  
  text-align: center!important  
}

/* .dx-datagrid-headers.dx-header-multi-row .dx-datagrid-content .dx-datagrid-table .dx-row.dx-header-row>td:last-child {
    text-align: center !important;
} */
</style>