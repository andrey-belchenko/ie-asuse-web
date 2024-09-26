<template>
    <!-- <DxSplitter id="splitter">
        <DxItem :resizable="true" :collapsible="true" size="300px" text="Left Pane">
            <ReportList @report-select="handleReportSelect" />
        </DxItem>
        <DxItem :resizable="true" :collapsible="true" min-size="70px">
            <div class="report-container">
                <Report v-if="selectedReport" :report-config="selectedReport" :key="selectedReport?.title" />
            </div>
        </DxItem>
    </DxSplitter> -->
    <Splitpanes class="default-theme">
        <Pane size="20" max>
            <ReportList @report-select="handleReportSelect" />
        </Pane>
        <Pane>
            <div>
                <Report v-if="selectedReport" :report-config="selectedReport" :key="selectedReport?.title" />
            </div>
        </Pane>
    </Splitpanes>
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
import { Splitpanes, Pane } from 'Splitpanes'
import 'Splitpanes/dist/Splitpanes.css'

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
<style>
.splitpanes__pane {
    background-color: unset !important;
    position: relative;
    transition: none !important;
}

.splitpanes__splitter {
    border-left: 1px solid #eee !important;
    border-right: 1px solid #eee !important;
    width: 20px;

    /* border: none !important;
    background-color: purple !important; */
}

.splitpanes__splitter::before {
    display: none !important;
}
.splitpanes__splitter::after {
    display: none !important;
}
/* .report-container {
    position: absolute;
    inset: 0;
} */
</style>
