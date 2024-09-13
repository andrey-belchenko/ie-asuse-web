<template>
    <DxDateBox v-model:value="props.modelValue" type="date" />
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

watch(() => props.modelValue, (newValue, oldValue) => {
    emit('update:modelValue', newValue);
});

</script>