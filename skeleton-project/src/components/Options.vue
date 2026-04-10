<template>
  <div class="outer">
    <Header
      @user-logout="emit('user-logout')"
      @go-home="emit('go-home')"
      @go-options-transaction="emit('go-options-transaction')"
      @go-options-budget="emit('go-options-budget')"
    />
    <div class="main-monitor">
      <div class="left-side-menu">
        <RouterLink :to="{ name: 'options/transactionDate' }"
          >날짜별 거래내역</RouterLink
        >
        <br />
        <RouterLink :to="{ name: 'options/transactionCategory' }"
          >카테고리별 거래내역</RouterLink
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
      <RouterView class="router" />
    </div>
    <Footer />
  </div>
</template>
<script setup>
import BudgetInOptions from "@/pages/BudgetSetting/BudgetInOptions.vue";
import Report from "@/pages/MoneyReport/Report.vue";
import Header from "./Header.vue";
import Footer from "./Footer.vue";

const emit = defineEmits(["user-logout"]);
</script>
<style scoped>
.outer {
  background-color: rgb(248, 244, 254);
}
.main-monitor {
  /* 화면 디자인 */
  margin: 50px 20px 0;
  padding: 40px 40px 0;
  background-color: white;
  border-radius: 60px 60px 0 0;
  border-top: 3px rgb(123, 76, 161) solid;
  border-left: 3px rgb(123, 76, 161) solid;
  border-right: 3px rgb(123, 76, 161) solid;

  /* 구성요소 배치 */
  display: flex;
}
.left-side-menu {
  justify-content: left;
  width: 200px;
}
.router {
  width: 1054px;
  padding-left: 60px;
  margin-bottom: 50px;
  border-left: 1px rgb(248, 244, 254) solid;
}
</style>
