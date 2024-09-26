<template>
    <div class="main" v-if="templateId">
        <!-- {{ reportUrl }} -->
        <iframe class="frame" :src="`http://localhost:5195/Report/DisplayReport?templateId=${templateId}&dataSetName=${tempId}&singleTable=true`"></iframe>
    </div>
</template>
<script setup lang="ts">
import type { RegularReport } from '@/features/reports/types/reports/RegularReport';
import type { FastReportsViewer as FastReportsViewerConfig } from '@/features/reports/types/views/FastReportsViewer';
import { ref, watch } from 'vue';
const props = defineProps({
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    },
    reportViewConfig: {
        type: Object as () => FastReportsViewerConfig,
        required: true
    },
    tempId: {
        type: String,
        required: true
    },
});


const templateId = ref(undefined);
const reportUrl = ref(undefined);

watch(()=>props.reportViewConfig, async () => {
    templateId.value = await props.reportViewConfig.prepareTemplate();
}, { immediate: true });

watch(templateId,  (val) => {
     reportUrl.value = `http://localhost:5195/Report/DisplayReport?templateId=${val}&dataSetName=report_temp`
});


</script>

<style scoped>
.main {
    position: absolute;
    inset: 0;
    /* background-color: red; */
    /* display: flex;
    justify-content: center;
    align-items: center; */
}

.frame {
    position: absolute;
    height: 100%;
    width: 100%;
    border: none;
    /* inset: 0; */
    /* display: flex;
    justify-content: center;
    align-items: center; */
}

/* .main * {
    text-align: center;
} */
</style>
