<template>
    <DxSplitter id="splitter">
        <DxItem :resizable="true" :collapsible="true" size="300px" text="Left Pane">
            <ReportList @report-select="handleReportSelect" />
        </DxItem>
        <DxItem :resizable="true" :collapsible="true" min-size="70px">
            <div class="report-container">
                <Report v-if="selectedReport" :report-config="selectedReport" :key="selectedReport?.title" />
            </div>

        </DxItem>
    </DxSplitter>
</template>

<script setup lang="ts">
import { DxSplitter, DxItem } from 'devextreme-vue/splitter';
import ReportList from './ReportList.vue';
import Report from './Report.vue';
import { ref } from 'vue';
import type { NavigatorItem } from '../types/Folder';
import { Report as ReportConfig } from '../types/Report';
import { RemoteExecutor } from '../services/RemoteExecutor';
import { Executor } from '../types/Executor';

Executor.setInstance(new RemoteExecutor())

const selectedReport = ref<ReportConfig>();
const handleReportSelect = (item: NavigatorItem) => {
    if (item instanceof ReportConfig) {
        selectedReport.value = item
    } else {
        selectedReport.value = undefined
    }
}

</script>
<style scoped>
/* .report-container {
    position: absolute;
    inset: 0;
} */
</style>
