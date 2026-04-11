<template>
  <div class="outer">
    <Header
      @user-logout="emit('user-logout')"
      @go-home="emit('go-home')"
      @go-options-transaction="emit('go-options-transaction')"
      @go-options-budget="emit('go-options-budget')"
      @go-options-report="emit('go-options-report')"
    />
    <div class="main-monitor">
      <div class="left-side-menu">
        <div
          class="side-menu-title"
          @click="router.push({ name: 'options/transactionDate' })"
        >
          거래내역 상세조회
        </div>
        <RouterLink
          :to="{ name: 'options/transactionDate' }"
          class="router-link"
          >날짜별 거래내역</RouterLink
        >
        <RouterLink
          :to="{ name: 'options/transactionCategory' }"
          class="router-link"
          >카테고리별 거래내역</RouterLink
        >
        <br />
        <div
          class="side-menu-title"
          @click="router.push({ name: 'options/budget' })"
        >
          예산 확인
        </div>
        <RouterLink :to="{ name: 'options/budget' }" class="router-link"
          >예산 - 예산 확인</RouterLink
        >
        <RouterLink :to="{ name: 'options/budget-setting' }" class="router-link"
          >예산 - 예산 설정</RouterLink
        >
        <br />
        <RouterLink
          :to="{ name: 'options/moneyreport' }"
          class="side-menu-title"
          >월별 리포트</RouterLink
        >
      </div>
      <RouterView class="router" />
    </div>
    <Footer />
  </div>
</template>
<script setup>
import BudgetInOptions from '@/pages/BudgetSetting/BudgetInOptions.vue';
import Report from '@/pages/MoneyReport/Report.vue';
import Header from './Header.vue';
import Footer from './Footer.vue';
import { useRouter } from 'vue-router';

const emit = defineEmits(['user-logout']);

const router = useRouter();
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
  display: flex;
  flex-direction: column;
  text-align: end;
  width: 200px;
  padding-right: 20px;
  padding-bottom: 100px;
}

.side-menu-title {
  text-decoration: none;
  color: black;
  text-align: end;
  margin-top: 10px;
  font-size: 25px;
  cursor: pointer;
}

.router-link {
  text-decoration: none;
  color: #828282;
  margin-top: 3px;
}

.router {
  width: 1054px;
  padding-left: 60px;
  padding-bottom: 50px;
  border-left: 1px rgb(248, 244, 254) solid;
}
</style>
