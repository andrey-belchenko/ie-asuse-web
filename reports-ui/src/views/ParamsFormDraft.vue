<template>
    <div>
        <div>Дата с</div>
        <DxDateBox v-model:value="date1"  type="date" />
    </div>
    <div>
        <div>Дата по</div>
        <DxDateBox v-model:value="date2"  type="date" />
    </div>
    <div>
        <div>Имя</div>
        <DxTextBox
              v-model:value="name"
              value-change-event="keyup"
            />
    </div>

   
</template>
<script setup lang="ts">
import { computed, ref } from 'vue';
import DxDateBox from 'devextreme-vue/date-box';
import DxTextBox from 'devextreme-vue/text-box';
const value = ref(new Date(1981, 3, 27));
const now = new Date();
const name = ref();
const date1 = ref();
const date2 = ref();

</script>
