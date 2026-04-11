<template>
  <div>
    <div>
      <div>전체 예산</div>
      <div>{{ totBudget }} 원</div>
    </div>
    <div>
      <div>총 지출</div>
      <div>{{ totOutcome }} 원</div>
    </div>
    <div>
      <div>남은 예산</div>
      <div>{{ leftBudget }} 원</div>
    </div>
  </div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';
import { useReportStore } from '@/stores/report';
import axios from 'axios';
import { computed, onMounted, ref } from 'vue';

const loginStore = useLoginStore();
const reportStore = useReportStore();

// 이번달에 맞는 문자열 설정
const todaydate = new Date();
const month = todaydate.getMonth() + 1;
const year = todaydate.getFullYear();
let settingDate;
const settingDatefunc = () => {
  if (month.toString().length < 2) {
    settingDate = `${year}-0${month}`;
  } else {
    settingDate = `${year}-${month}`;
  }
};

// 화면에 출력할 정보
const totBudget = ref(0);
const totOutcome = ref(0);
const leftBudget = ref(0);

// 예산 데이터 불러오기
const budgetLoading = async () => {
  // user의 예산 설정 정보 불러오기
  const resp = await axios.get(`/api/users/${loginStore.user.id}`);
  const budgetList = resp.data.userBudget;

  // budgetList 중 현재 달의 총 예산 들고오기
  for (let i = 0; i < budgetList.length; i++) {
    if (budgetList[i].budgetYearMonth.indexOf(settingDate) !== -1) {
      totBudget.value = budgetList[i].budgetTot;
      // console.log('if문 들어옴');
    }
    // console.log('for문', budgetList[i].budgetYearMonth);
  }
  // console.log('totbudget', totBudget.value, settingDate);
};

onMounted(async () => {
  // 이번달에 해당하는 문자열 들고오기
  settingDatefunc();

  // 예산 데이터 불러오기
  budgetLoading();

  // 총 예산을 report.js에서 계산한 후 받아오기
  await reportStore.userData;
  // 이번달 총 지출 들고오기
  totOutcome.value = reportStore.totOutcome;

  // 남은예산 계산
  leftBudget.value = totBudget.value - totOutcome.value;
});
</script>
