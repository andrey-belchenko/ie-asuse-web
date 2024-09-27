<template>
    <DxDateBox :value="dateValue" type="date" @value-changed="updateValue" />
</template>

<script setup lang="ts">
import { ref, watch } from 'vue';
import DxDateBox from 'devextreme-vue/date-box';

const props = defineProps({
    modelValue: {
        type: Date,
    }
});

const emit = defineEmits(['update:modelValue']);

let dateValue = ref(props.modelValue);

watch(() => props.modelValue, (newValue) => {
    dateValue.value = newValue;
});

watch(dateValue, (newValue) => {
    emit('update:modelValue', newValue);
});

const updateValue = (e) => {
    dateValue.value = e.value;
};
</script>