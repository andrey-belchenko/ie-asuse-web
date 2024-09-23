<template>
    <div class="main" v-if="templateId">
        <!-- {{ reportUrl }} -->
        <!-- <div>
            <h1> Компонент для просмотра отчета FastReports</h1>
            <h2> Template name: {{ viewConfig.templateName }} </h2>
        </div> -->
        <iframe class="frame" :src="`http://localhost:5195/Report/DisplayReport?templateId=${templateId}&dataSetName=report_temp&singleTable=true`"></iframe>

    </div>
</template>
<script setup lang="ts">
import type { RegularReport } from '@/reports/types/reports/RegularReport';
import type { FastReportsViewer } from '@/reports/types/views/FastReportsViewer';
import { ref, watch } from 'vue';
const props = defineProps({
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    }
});

const viewConfig = ref(props.reportConfig.view as FastReportsViewer);
const templateId = ref(undefined);
const reportUrl = ref(undefined);

watch(viewConfig, async () => {
    templateId.value = await viewConfig.value.prepareTemplate();
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
