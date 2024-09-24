<template>
    <div class="rep-table">
        <DxDataGrid :data-source="dataSource" :show-borders="false" :focused-row-enabled="true"
            :default-focused-row-index="0" :column-auto-width="true" :column-hiding-enabled="false"
            :show-column-lines="true" :show-row-lines="true" :hover-state-enabled="true" :allow-column-resizing="true"
            @exporting="onExporting" column-resizing-mode="widget" :columns="reportViewConfig.columns"
            :summary="reportViewConfig.summary" @initialized="saveGridInstance">
            <DxRemoteOperations :filtering="true" :sorting="true" :group-paging="true" :summary="true" :grouping="true">
            </DxRemoteOperations>
            <DxPaging :enabled="false" />
            <DxFilterRow :visible="true" />
            <DxScrolling :useNative="false" mode="virtual" />
            <DxHeaderFilter :visible="true" />
            <DxFilterPanel :visible="true" />
            <DxGroupPanel :visible="true" />
            <DxGrouping :auto-expand-all="true" />
            <DxExport :enabled="true" :allow-export-selected-data="false" />
            <DxSelection mode="single" />
        </DxDataGrid>
    </div>
</template>

<script setup lang="ts">
import { ref } from 'vue';
import {
    DxDataGrid, DxPaging, DxFilterRow, DxScrolling, DxHeaderFilter, DxFilterPanel, DxRemoteOperations, DxSummary, DxTotalItem,
    DxExport, DxSelection, DxGroupPanel, DxGrouping,
    type DxDataGridTypes,
} from 'devextreme-vue/data-grid';
import type { RegularReport } from '../../types/reports/RegularReport';
import { createDataSource } from "../../../api-client/mongo.js";
import { Workbook } from 'exceljs';
import { saveAs } from 'file-saver-es';
import { exportDataGrid } from 'devextreme/excel_exporter';
import type { ReportTable as ReportTableConfig } from '@/reports/types/views/ReportTable';


const props = defineProps({
    params: {
        type: Object,
    },
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    },
    reportViewConfig: {
        type: Object as () => ReportTableConfig,
        required: true
    },
    tempId: {
        type: String,
        required: true
    },
});

const dataSource = ref(createDataSource({
    // database: "bav_test_report",
    collectionName: props.tempId + (props.reportViewConfig.sourceTableName ? `.${props.reportViewConfig.sourceTableName}` : "")
}));

let dataGridInstance: any = null;


const saveGridInstance = (e: any) => {
    dataGridInstance = e.component;
}

const refresh = () => {
    dataGridInstance.refresh();
}


const onExporting = (e: DxDataGridTypes.ExportingEvent) => {
    const workbook = new Workbook();
    const worksheet = workbook.addWorksheet("Отчет");
    exportDataGrid({
        component: e.component,
        worksheet,
        autoFilterEnabled: true,
    }).then(() => {
        workbook.xlsx.writeBuffer().then((buffer: any) => {
            saveAs(new Blob([buffer], { type: 'application/octet-stream' }), `${props.reportConfig.title}.xlsx`);
        });
    });
    e.cancel = true;
};

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
    text-align: center !important
}

/* .dx-datagrid-headers.dx-header-multi-row .dx-datagrid-content .dx-datagrid-table .dx-row.dx-header-row>td:last-child {
    text-align: center !important;
} */
</style>