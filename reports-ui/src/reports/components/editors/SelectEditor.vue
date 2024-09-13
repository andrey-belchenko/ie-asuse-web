<template>
    <DxDropDownBox v-model:value="gridBoxValue" :defer-rendering="false" :show-clear-button="true"
        :drop-down-options="{ resizeEnabled: true }" :data-source="gridDataSource"
        :display-expr="configuration?.displayField" :value-expr="configuration?.keyField">
        <template #content="{ data }">
            <DxDataGrid :height="345" :data-source="gridDataSource" :columns="gridColumns" :hover-state-enabled="true"
                :column-auto-width="true" v-model:selected-row-keys="gridBoxValue">
                <DxSelection mode="multiple" show-check-boxes-mode="always" />
                <DxFilterRow :visible="true" />
                <DxScrolling mode="virtual" />
            </DxDataGrid>
        </template>
    </DxDropDownBox>
    {{ formValues }}
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import {
    DxDataGrid, DxSelection, DxPaging, DxFilterRow, DxScrolling,
} from 'devextreme-vue/data-grid';
import type { SelectEditor as SelectEditorConfig } from '@/reports/types/editors/SelectEditor';
import { makeDataSource } from './SelectEditor';
const props = defineProps({
    modelValue: {
        type: Array,
    },
    configuration: {
        type: Object as () => SelectEditorConfig,
    },
    formValues: {
        type: Object
    },
});

const gridColumns = ref(props.configuration?.columns);

const gridDataSource = makeDataSource(props.configuration!, props.formValues);

const gridBoxValue = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);
watch(gridBoxValue, (newValue, oldValue) => {
    emit('update:modelValue', newValue);
});





</script>