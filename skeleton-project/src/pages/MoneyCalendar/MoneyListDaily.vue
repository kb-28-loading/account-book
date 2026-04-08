<template>
  <div>해당 날짜에 해당하는 거래내역</div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';
import { useRoute } from 'vue-router';

// route를 통해 경로에서 날짜를 문자열로 추출
const currentRoute = useRoute();
const selectedDate = currentRoute.params.selectedDate.toString();

// 저장되어있는 사용자의 거래내역 중 해당 날짜인 객체 추출 후 배열로 저장
const loginStore = useLoginStore();
const dailyList = loginStore.user.moneyList.filter(
  (item) => item.date === selectedDate,
);
</script>
