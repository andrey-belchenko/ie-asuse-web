<template>
    <div class="main">
        <!-- <a :href="`http://localhost:4000/file/${reportViewConfig.fileId}`">
            <DxButton text="Скачать отчет">
            </DxButton>
        </a> -->
        <!-- <div ref="excelViewRef"></div> -->
        <!-- <div v-html="excelHtml"></div> -->
    </div>
</template>
<script setup lang="ts">
// import { DxButton } from 'devextreme-vue/button';
import type { RegularReport } from '@/features/reports/types/reports/RegularReport';
import type { FileViewer as FileViewerConfig } from '@/features/reports/types/views/FileViewer';
import { onMounted } from 'vue';
// import { onMounted, ref } from 'vue';
// import axios from "axios";
// import ExcelViewer from "excel-viewer";
// import xlsxPreview from 'xlsx-preview';

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

// const excelViewRef = ref(null);
// const excelHtml = ref("");
// onMounted(async () => {
//     let res = await axios({
//         url: `http://localhost:4000/file/${props.reportViewConfig.fileId}`,
//         method: "GET",
//         responseType: "arraybuffer"
//     })
//     excelHtml.value = await xlsxPreview.xlsx2Html(res.data);
// })
// onMounted(() => {
//     const link = document.createElement('a');
//     link.href = `http://localhost:4000/file/${props.reportViewConfig.fileId}`;
//     document.body.appendChild(link);
//     link.click();
//     document.body.removeChild(link);
// })
</script>

<!-- <style scoped>
.main {
    position: absolute;
    inset: 0;
    display: grid;
    justify-content: center;
    align-content: center;
}
</style> -->
