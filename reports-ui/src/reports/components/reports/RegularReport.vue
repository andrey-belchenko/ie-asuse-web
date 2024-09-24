<template>
    <div class="main">
        <DxSplitter id="rep-splitter2">
            <DxItem v-if="paramsFormConfig" :resizable="true" :collapsible="true" size="300px">

                <ParamsForm :formConfig="paramsFormConfig" v-model:values="formValues" />

                <DxToolbar class="toolbar">
                    <TbItem>
                        <ActionButton text="Сформировать отчет" @press="onSubmit" :loading="executing" :width="180"
                            :height="30" />
                    </TbItem>
                </DxToolbar>
                <!-- rep {{ JSON.stringify(formValues) }}  -->
                tt: {{ tempId }}
            </DxItem>
            <DxItem :resizable="true" :collapsible="true" min-size="70px">
                <!-- <ReportView v-if="ready" :params="formValues" :report-config="reportConfig" :exec-id="execId" /> -->
                <div class="view-container">
                    <ReportView ref="reportViewRef" v-if="ready" :params="formValues" :report-config="reportConfig"
                        :key="execId" :exec-id="execId" :tempId />
                </div>
            </DxItem>
        </DxSplitter>

    </div>

</template>

<script setup lang="ts">
import { DxSplitter, DxItem } from 'devextreme-vue/splitter';
import DxToolbar, { DxItem as TbItem } from 'devextreme-vue/toolbar';
import ParamsForm from '../ParamsForm.vue';
import { onMounted, ref, watch } from 'vue';
import { RegularReport } from '../../types/reports/RegularReport';
import ReportView from '../ReportView.vue';
import notify from 'devextreme/ui/notify';
import { v4 as uuidv4 } from 'uuid';
import ActionButton from '../ActionButton.vue';
// import { runReport } from './RegularReport';
import type { ReportViewComponent } from '../ReportView';
import { Form } from '@/reports/types/Form';
const props = defineProps({
    reportConfig: {
        type: Object as () => RegularReport,
        required: true
    }
});


const reportViewRef = ref<ReportViewComponent>();
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
        executing.value = false;
        ready.value = true;
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
