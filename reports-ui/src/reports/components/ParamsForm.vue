<template>
    <div v-if="formConfig" class="form">
        <div v-for="fieldConfig in formConfig.fields" :key="fieldConfig.name">
            <div class="label">{{ fieldConfig.label }}</div>
            <component :is="getEditorComponent(fieldConfig.editor)" :configuration="fieldConfig.editor"
                v-model="values[fieldConfig.name]" />
        </div>
        {{ JSON.stringify(values) }}
    </div>
</template>

<script setup lang="ts">
import { reactive, watchEffect } from 'vue';
import { getDefaultValues, getEditorComponent } from './ParamsForm';
import type { Form } from '../types/Form';

const props = defineProps({
    formConfig: {
        type: Object as () => Form,
        required: true
    }
});

const values = reactive<any>(getDefaultValues(props.formConfig));
const emit = defineEmits(['update:values']);

watchEffect(() => {
    // debugger
    emit('update:values', { ...values });
});

</script>

<style scoped>
.form {
    margin: 10px 3px;
}

.label {
    margin: 5px 0px 5px 0px;
}
</style>