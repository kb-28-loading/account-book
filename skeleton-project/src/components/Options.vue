<template>
  <div>
    <h1>세부메뉴 선택 시 화면</h1>
    <div>
      <RouterLink :to="{ name: 'options/transaction' }"
        >거래내역 확인</RouterLink
      >
      <br />
      <RouterLink :to="{ name: 'options/budget-setting' }"
        >예산 - 예산 설정</RouterLink
      >
      <br />
      <RouterLink :to="{ name: 'options/budget' }">예산 - 예산 확인</RouterLink>
      <br />
      <RouterLink :to="{ name: 'options/moneyreport' }">월별 리포트</RouterLink>
    </div>
    <RouterView />
  </div>
</template>
<script setup>
import BudgetInOptions from "@/pages/BudgetSetting/BudgetInOptions.vue";
import Report from "@/pages/MoneyReport/Report.vue";
</script>
