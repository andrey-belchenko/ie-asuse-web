<template>
    <ReportTable v-if="isTable" :params="params" :report-config="reportConfig"
        :report-view-config="(reportViewConfig as ReportTableConfig)" :temp-id="tempId" />
    <FastReportViewer v-if="isFastReportViewer" :params="params" :report-config="reportConfig"
        :report-view-config="(reportViewConfig as FastReportsViewerConfig)" :temp-id="tempId" />
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
import { ReportView as ReportViewConfig } from '../types/ReportView';

const props = defineProps({
    params: {
        type: Object,
    },
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    },
    reportViewConfig: {
        type: Object as () => ReportViewConfig,
        required: true
    },
    tempId: {
        type: String,
        required: true
    },
});

const isTable = ref(props.reportViewConfig instanceof ReportTableConfig)
const isFastReportViewer = ref(props.reportViewConfig instanceof FastReportsViewerConfig)


const refresh = () => {
    notify("refresh")
};

defineExpose<ReportViewComponent>({
    refresh
});

</script>