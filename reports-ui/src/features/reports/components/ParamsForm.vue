<template>
    <div v-if="formConfig" class="form">
        <div v-for="fieldConfig in formConfig.fields" :key="fieldConfig.name">
            <div class="label">{{ fieldConfig.label }}</div>
            <!-- <div class="label">{{ values[fieldConfig.name] }}</div> -->
            <component :is="getEditorComponent(fieldConfig.editor)" :configuration="fieldConfig.editor"
                :key="fieldConfig.editor.id" v-model="values[fieldConfig.name]" />
        </div>
        <!-- {{ JSON.stringify(values) }} -->
    </div>
</template>

<script setup lang="ts">
import { onMounted, provide, reactive, ref, watch, watchEffect } from 'vue';
import { getDefaultValues, getEditorComponent } from './ParamsForm';
import type { Form } from '../types/Form';

const props = defineProps({
    formConfig: {
        type: Object as () => Form,
        required: true
    }
});


// начальное значение объект со всеми именами полей чтобы подписаться на изменение
const values = reactive<any>(props.formConfig.fields.reduce(function (obj, item) {
    obj[item.name] = null;
    return obj;
}, {}));

onMounted(async () => {
    const defaultValues = await getDefaultValues(props.formConfig);
    for (const key in defaultValues) {
        values[key] = defaultValues[key];
    }
});
const emit = defineEmits(['update:values']);

const changesValues = ref([]);

watchEffect(() => {
    emit('update:values', { ...values });
});

for (let key in values) {
    watch(
        () => values[key],
        () => {
            changesValues.value = [key];
        }
    );
}

provide("formValues", values);
provide("changesValues", changesValues);

</script>

<style scoped>


.label {
    margin: 5px 0px 5px 5px;
}
</style>