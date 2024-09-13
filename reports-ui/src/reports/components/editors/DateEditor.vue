<template>
    <DxDateBox v-model:value="props.value" type="date" />
</template>
<script setup lang="ts">
import { ref, watch } from 'vue';
import DxDateBox from 'devextreme-vue/date-box';

const props = defineProps({
    value: {
        type: Date,
    }
});

const emit = defineEmits(['update:value']);

watch(() => props.value, (newValue, oldValue) => {
    emit('update:value', newValue);
});

</script>