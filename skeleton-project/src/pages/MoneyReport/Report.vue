<template>
  <div>
    <div class="title">
      <h1>이번달 소비 리포트</h1>
      <h4>{{ reportStore.year }}</h4>
    </div>

    <hr class="title-underline" />
    <div class="month-select row">
      <div class="col">
        <i
          class="fa-solid fa-arrow-left left-arrow"
          @click.stop="beforeMonth"
        ></i>
      </div>
      <div class="col selected-month">{{ reportStore.month }}</div>
      <div class="col">
        <i
          class="fa-solid fa-arrow-right right-arrow"
          @click.stop="nextMonth"
        ></i>
      </div>
    </div>
    <div class="options-main-container">
      <div class="report-graph-group">
        <ReportLeft
          class="report-graph"
          :category="reportStore.usedCategoryIncome"
          :data="reportStore.sortedIncomeMoney"
          :colorList="colorList"
        /><ReportRight
          class="report-graph graph-right"
          :category="reportStore.usedCategoryOutcome"
          :data="reportStore.sortedOutcomeMoney"
          :colorList="colorList"
        />
      </div>
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

async () => {
  await reportStore.userData;
};

const nextMonth = async () => {
  if (reportStore.month === 12) {
    reportStore.month = 1;
    reportStore.year++;
    console.log('다음달', reportStore.month, reportStore.year);

    await reportStore.userData;
  } else {
    reportStore.month++;
    console.log('다음달', reportStore.month, reportStore.year);

    await reportStore.userData;
    console.log('확인', reportStore.usedCategoryOutcome);
  }
};
const beforeMonth = async () => {
  if (reportStore.month === 1) {
    reportStore.month = 12;
    reportStore.year--;
    console.log('이전달', reportStore.month, reportStore.year);

    await reportStore.userData;
  } else {
    reportStore.month--;
    console.log('이전달', reportStore.month, reportStore.year);

    await reportStore.userData;
  }
};
</script>
<style scoped>
.title {
  display: flex;
  align-items: end;
  gap: 10px;
}
.month-select {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.left-arrow {
  font-size: 28px;
  cursor: pointer;
}
.selected-month {
  font-size: 35px;
  text-align: center;
}
.right-arrow {
  font-size: 28px;
  cursor: pointer;
  display: flex;
  justify-content: end;
}

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
