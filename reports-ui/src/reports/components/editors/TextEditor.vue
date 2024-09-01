<template>
    <DxTextBox v-model:value="fieldValue" value-change-event="keyup" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import DxTextBox from 'devextreme-vue/text-box';

const props = defineProps({
    modelValue: {
        type: String,
        required: false
    }
});

const fieldValue = ref(props.modelValue);

const emit = defineEmits(['update:modelValue']);

watch(fieldValue, (newValue, oldValue) => {
    emit('update:modelValue', newValue);
});

</script>