<template>
  <div>
    <h1>세부메뉴 선택 시 화면</h1>
    <Header
      @user-logout="emit('user-logout')"
      @go-home="emit('go-home')"
      @go-options-transaction="emit('go-options-transaction')"
      @go-options-budget="emit('go-options-budget')"
    />
    <div class="main-monitor">
      <div class="left-side-menu">
        <RouterLink :to="{ name: 'options/transaction' }"
          >거래내역 확인</RouterLink
        >
        <br />
        <RouterLink :to="{ name: 'options/budget-setting' }"
          >예산 - 예산 설정</RouterLink
        >
        <br />
        <RouterLink :to="{ name: 'options/budget' }"
          >예산 - 예산 확인</RouterLink
        >
        <br />
        <RouterLink :to="{ name: 'options/moneyreport' }"
          >월별 리포트</RouterLink
        >
      </div>
      <RouterView />
    </div>
    <Footer />
  </div>
</template>
<script setup>
import BudgetInOptions from '@/pages/BudgetSetting/BudgetInOptions.vue';
import Report from '@/pages/MoneyReport/Report.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';

const emit = defineEmits(['user-logout']);
</script>
