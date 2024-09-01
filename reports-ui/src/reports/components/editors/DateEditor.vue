<template>
    <DxDateBox v-model:value="fieldValue" type="date" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import DxDateBox from 'devextreme-vue/date-box';

const props = defineProps({
    modelValue: {
        type: Date,
        required: false
    }
});

const fieldValue = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

watch(fieldValue, (newValue, oldValue) => {
    emit('update:modelValue', newValue);
});

</script>