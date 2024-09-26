<template>
    <RegularReport v-if="regularReport" :report-config="regularReport" :key="regularReport?.title" />
    <GeneratorReport v-if="generatorReport" :report-config="generatorReport" :key="regularReport?.title" />
</template>

<script setup lang="ts">
import RegularReport from './reports/RegularReport.vue';
import GeneratorReport from './reports/GeneratorReport.vue';
import { ref } from 'vue';
import { Report as ReportConfig } from '../types/Report';
import { RegularReport as RegularReportConfig } from '../types/reports/RegularReport';
import { GeneratorReport as GeneratorReportConfig } from '../types/reports/GeneratorReport';

const props = defineProps({
    reportConfig: {
        type: Object as () => ReportConfig,
        required: true
    }
});

const regularReport = ref(props.reportConfig instanceof RegularReportConfig ? props.reportConfig : undefined);
const generatorReport = ref(props.reportConfig instanceof GeneratorReportConfig ? props.reportConfig : undefined);


</script>
