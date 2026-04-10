<template>
  <div>
    <h1>이번달 소비 리포트</h1>
    <hr class="title-underline" />
    <div class="report-graph-group">
      <ReportLeft
        class="report-graph"
        :category="usedCategoryIncome"
        :data="sortedIncomeMoney"
        :colorList="colorList"
      /><ReportRight
        class="report-graph graph-right"
        :category="usedCategoryOutcome"
        :data="sortedOutcomeMoney"
        :colorList="colorList"
      />
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import { useReportStore } from '@/stores/report';
import { onMounted } from 'vue';
import { ref } from 'vue';

import ReportLeft from '@/components/MoneyReport/ReportLeft.vue';
import ReportRight from '@/components/MoneyReport/ReportRight.vue';

const reportStore = useReportStore();

const colorList = [
  '#BFA5D4',
  '#CDBAE7',
  '#E1DAE5',
  '#FEF2FC',
  '#F3F7FF',
  '#F8F4FC',
];

onMounted(async () => {
  await reportStore.userData();
});

const usedCategoryIncome = ref(reportStore.usedCategoryIncome);
const usedCategoryOutcome = ref(reportStore.usedCategoryOutcome);
const sortedIncomeMoney = ref(reportStore.sortedIncomeMoney);
const sortedOutcomeMoney = ref(reportStore.sortedOutcomeMoney);
</script>
<style scoped>
.report-graph-group {
  display: flex;
}
.report-graph {
  width: 500px;
}
.graph-right {
  padding-left: 60px;
  border-left: 2px solid rgb(248, 244, 254);
}
</style>
