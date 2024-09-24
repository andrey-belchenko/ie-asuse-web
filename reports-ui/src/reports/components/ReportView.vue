<template>
    <ReportTable v-if="isTable" :params="params" :report-config="reportConfig" :temp-id="tempId" />
    <FastReportViewer v-if="isFastReportViewer" :params="params" :report-config="reportConfig" :temp-id="tempId" />
</template>

<script setup lang="ts">
import type { RegularReport } from '../types/reports/RegularReport';
import ReportTable from './views/ReportTable.vue';
import FastReportViewer from './views/FastReportViewer.vue';
import { defineExpose, ref } from 'vue';
import type { ReportViewComponent } from './ReportView';
import notify from 'devextreme/ui/notify';
import { ReportTable as ReportTableConfig } from '../types/views/ReportTable';
import { FastReportsViewer as FastReportsViewerConfig } from '../types/views/FastReportsViewer';

const props = defineProps({
    params: {
        type: Object,
    },
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    },
    tempId: {
        type: String,
        required: true
    },
});

const isTable = ref(props.reportConfig.view instanceof ReportTableConfig)
const isFastReportViewer = ref(props.reportConfig.view instanceof FastReportsViewerConfig)


const refresh = () => {
    notify("refresh")
};

defineExpose<ReportViewComponent>({
    refresh
});

</script>