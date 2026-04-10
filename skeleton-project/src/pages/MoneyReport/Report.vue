<template>
  <div>
    <h1>소비 리포트 관련 화면</h1>
  </div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';
import axios from 'axios';
import { onMounted, ref } from 'vue';

// 로그인 한 사용자의 거래내역 정보를 받아오기
const loginStore = useLoginStore();
const moneyList = ref([]);
const userData = async () => {
  const resp = await axios.get(`/api/users/${loginStore.user.id}`);
  moneyList.value = resp.data.moneyList;
  console.log(111);

  reportDate();
  categoryCalc();
};
userData();

const date = new Date();
const month = ref(date.getMonth() + 1);
const year = ref(date.getFullYear());

// 정해진 달에 해당하는 거래내역을 필터링
const moneyListFiltered = ref([]);
const reportDate = () => {
  let settingDate = '';

  // 1-9월 앞에 0 붙이기
  if (month.value.toString().length < 2) {
    settingDate = `${year.value}-0${month.value}`;
  } else {
    settingDate = `${year.value}-${month.value}`;
  }

  // moneyList내 정해진 달의 거래내역 저장
  for (let i = 0; i < moneyList.value.length; i++) {
    if (moneyList.value[i].date.indexOf(settingDate) !== -1) {
      moneyListFiltered.value.push(moneyList.value[i]);
    }
  }
};

// 카테고리 별 금액 합산
const usedCategoryOutcome = ref([]);
const usedCategoryIncome = ref([]);
const categoryCalc = () => {
  // 수입 데이터와 지출 데이터를 구분지어서 이용된 카테고리를 각각 저장
  for (let i = 0; i < moneyListFiltered.value.length; i++) {
    if (moneyListFiltered.value[i].type === '수입') {
      if (
        usedCategoryIncome.value.filter(
          (c) => c === moneyListFiltered.value[i].category,
        ).length === 0
      ) {
        usedCategoryIncome.value.push(moneyListFiltered.value[i].category);
      }
    }
    if (moneyListFiltered.value[i].type === '수입') {
      if (
        usedCategoryOutcome.value.filter(
          (c) => c === moneyListFiltered.value[i].category,
        ).length === 0
      ) {
        usedCategoryOutcome.value.push(moneyListFiltered.value[i].category);
      }
    }
  }
  console.log(usedCategory.value);
};
</script>
