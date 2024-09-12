<template>
    <div v-if="formConfig" class="form">
        <div v-for="fieldConfig in formConfig.fields" :key="fieldConfig.name">
            <div class="label">{{ fieldConfig.label }}</div>
            <!-- <div class="label">{{ values[fieldConfig.name] }}</div> -->
            <component :is="getEditorComponent(fieldConfig.editor)" :configuration="fieldConfig.editor"
                v-model="values[fieldConfig.name]" />
        </div>
        {{ JSON.stringify(values) }}
    </div>
</template>

<script setup lang="ts">
import { onMounted, reactive, watchEffect } from 'vue';
import { getDefaultValues, getEditorComponent } from './ParamsForm';
import type { Form } from '../types/Form';

const props = defineProps({
    formConfig: {
        type: Object as () => Form,
        required: true
    }
});

const values = reactive<any>({ });

onMounted(async () => {
    const defaultValues = await getDefaultValues(props.formConfig);
    for (const key in defaultValues) {
        values[key] = defaultValues[key];
    }
});
const emit = defineEmits(['update:values']);

watchEffect(() => {
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