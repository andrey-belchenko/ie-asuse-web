<template>
    <div class="main">
        <Splitpanes class="default-theme">
            <Pane v-if="paramsFormConfig" size="20">

                <ParamsForm :formConfig="paramsFormConfig" v-model:values="formValues" />

                <DxToolbar class="toolbar">
                    <TbItem>
                        <ActionButton text="Сформировать отчет" @press="onSubmit" :loading="executing" :width="180"
                            :height="30" />
                    </TbItem>
                </DxToolbar>
            </Pane>
            <Pane>
                <div class="view-container">
                    <ReportView ref="reportViewRef" v-if="ready" :params="formValues" :report-config="reportConfig"
                        :report-view-config="reportViewConfig" :key="execId" :exec-id="execId" :tempId />
                </div>
            </Pane>
        </Splitpanes>


    </div>

</template>

<script setup lang="ts">
import DxToolbar, { DxItem as TbItem } from 'devextreme-vue/toolbar';
import ParamsForm from '../ParamsForm.vue';
import { onMounted, ref } from 'vue';
import { RegularReport } from '../../types/reports/RegularReport';
import ReportView from '../ReportView.vue';
import { v4 as uuidv4 } from 'uuid';
import ActionButton from '../ActionButton.vue';
import { ReportView as ReportViewConfig } from '../../types/ReportView';
// import { runReport } from './RegularReport';
import type { ReportViewComponent } from '../ReportView';
import { Form } from '@/features/reports/types/Form';
import { Splitpanes, Pane } from 'Splitpanes'
import 'Splitpanes/dist/Splitpanes.css'
import { FileViewer as FileViewerConfig } from '../../types/views/FileViewer';
const props = defineProps({
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    }
});


const reportViewRef = ref<ReportViewComponent>();
const reportViewConfig = ref<ReportViewConfig>();
const formValues = ref({});
const execId = ref<string>();
const executing = ref(false);
const tempId = ref(undefined);
const ready = ref(false);
const paramsFormConfig = ref<Form>();

onMounted(async () => {
    paramsFormConfig.value = await props.reportConfig.paramsForm();
});

const onSubmit = () => {
    const action = async () => {
        execId.value = uuidv4();
        executing.value = true;
        ready.value = false;
        // await runReport(props.reportConfig!, formValues.value);
        let execResult = await props.reportConfig!.execute({ formValues: formValues.value });
        tempId.value = execResult.tempId;
        reportViewConfig.value = execResult.view;
        executing.value = false;
        ready.value = true;

        if (execResult.view instanceof FileViewerConfig) {
            const link = document.createElement('a');
            link.href = `http://localhost:4000/file/${execResult.view.fileId}`;
            document.body.appendChild(link);
            link.click();
            document.body.removeChild(link);
        }
    }
    action();
}

</script>

<style scoped>
.main {
    position: absolute;
    inset: 0;
}

.toolbar {
    margin: 20px 0px;
}

.view-container {
    position: absolute;
    inset: 0;
}
</style>
