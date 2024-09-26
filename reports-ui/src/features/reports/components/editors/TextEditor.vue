<template>
    <DxTextBox v-model:value="fieldValue" value-change-event="keyup" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import DxTextBox from 'devextreme-vue/text-box';

const props = defineProps({
    value: {
        type: String,
        required: false
    }
});

const fieldValue = ref(props.value);

const emit = defineEmits(['update:value']);

watch(fieldValue, (newValue, oldValue) => {
    emit('update:value', newValue);
});

</script>