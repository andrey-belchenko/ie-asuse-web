<template>
    <div class="main" v-if="reportConfig">
        <div>
            <h1> Компонент для просмотра отчета FastReports</h1>
            <h2> Template name: {{ viewConfig.templateName }} </h2>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { RegularReport } from '@/reports/types/reports/RegularReport';
import type { FastReportsViewer } from '@/reports/types/views/FastReportsViewer';
import { ref } from 'vue';
const props = defineProps({
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    }
});

const viewConfig = ref(props.reportConfig.view as FastReportsViewer);
</script>

<style scoped>
.main {
    position: absolute;
    inset: 0;
    display: flex;
    justify-content: center;
    align-items: center;
}
.main * {
    text-align: center;
}
</style>
