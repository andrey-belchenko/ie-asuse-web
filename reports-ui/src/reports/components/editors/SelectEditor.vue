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
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import DxDropDownBox from 'devextreme-vue/drop-down-box';
import {
    DxDataGrid, DxSelection, DxPaging, DxFilterRow, DxScrolling,
} from 'devextreme-vue/data-grid';
import CustomStore from 'devextreme/data/custom_store';
import type { SelectEditor as SelectEditorConfig } from '@/reports/types/editors/SelectEditor';
import { queryTable } from '@/api-client/pg';

const props = defineProps({
    value: {
        type: Array,
        required: false
    },
    configuration: {
        type: Object as () => SelectEditorConfig,
        required: false
    }
});

const gridColumns = ref(props.configuration?.columns);

const gridDataSource = makeDataSource(props.configuration!);

const gridBoxValue = ref(props.value);

const emit = defineEmits(['update:value']);
watch(gridBoxValue, (newValue, oldValue) => {
    emit('update:value', newValue);
});


function makeDataSource(config: SelectEditorConfig) {
    return new CustomStore({
        loadMode: 'raw',
        key: config.keyField,
        load() {
            
            if (config.listItems) {
                return config.listItems()
            } else {
                return []
            }
            // return config.data ?? queryTable({ tableName: config.tableName! })
        },
    });
}


</script>