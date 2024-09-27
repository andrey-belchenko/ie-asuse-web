<template>
    <div class="main">
        <a :href="`http://localhost:4000/file/${reportViewConfig.fileId}`">Скачать {{ reportViewConfig.fileName }}</a>
        <div ref="excelViewRef"></div>
    </div>
</template>
<script setup lang="ts">
import type { RegularReport } from '@/features/reports/types/reports/RegularReport';
import type { FileViewer as FileViewerConfig } from '@/features/reports/types/views/FileViewer';
import { onMounted, ref } from 'vue';
import axios from "axios";
import ExcelViewer from "excel-viewer";

const props = defineProps({
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    },
    reportViewConfig: {
        type: Object as () => FileViewerConfig,
        required: true
    },
    tempId: {
        type: String,
        required: true
    },
});

const excelViewRef = ref(null);

onMounted(async () => {

    axios({
        url: `http://localhost:4000/file/${props.reportViewConfig.fileId}`,
        method: "GET",
        responseType: "arraybuffer"
    }).then(res => {
        new ExcelViewer(excelViewRef.value, res.data);
    })
})
</script>

<style scoped>
.main {
    position: absolute;
    inset: 0;
}
</style>
