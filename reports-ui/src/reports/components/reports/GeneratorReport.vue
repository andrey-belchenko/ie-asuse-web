<template>
    <div class="main" v-if="reportConfig">
        <div>
            <h1> Компонент для просмотра отчета из ГО</h1>
            <h2> Id отчета: {{ reportConfig.reportId }} </h2>
        </div>

    </div>
</template>

<script setup lang="ts">
import type { GeneratorReport } from '@/reports/types/reports/GeneratorReport';
const props = defineProps({
    reportConfig: {
        type: Object as () => GeneratorReport,
        required: true
    }
});
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
