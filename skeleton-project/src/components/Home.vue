<template>
  <div class="outer">
    <Header @user-logout="emit('user-logout')" @go-home="emit('go-home')"
      @go-options-transaction="emit('go-options-transaction')" @go-options-budget="emit('go-options-budget')"
      @go-options-report="emit('go-options-report')" />

    <div class="main-monitor">
      <Budget />
      <div class="row g-4 mt-3 content-row">
        <div class="col-xl-7 col-lg-12 d-flex flex-column">
          <router-view></router-view>
        </div>
        <div class="col-xl-5 col-lg-12 d-flex flex-column">
          <router-view name="right"></router-view>
        </div>
      </div>
    </div>

    <Footer />
  </div>
</template>
<script setup>
import Calender from '@/components/Calender.vue';
import Budget from './Budget.vue';
import Header from './Header.vue';
import MoneyList from './MoneyList.vue';
import Footer from './Footer.vue';

const emit = defineEmits([
  'user-logout',
  'go-home',
  'go-options-transaction',
  'go-options-budget',
  'go-options-report',
]);
</script>
<style>
.outer {
  background-color: rgb(248, 244, 254);
}

.main-monitor {
  /* 화면 디자인 */
  margin: 50px 20px 0;
  padding: 40px 40px 60px;
  /* 0 -> 60 */
  background-color: white;
  border-radius: 60px 60px 0 0;
  border-top: 3px rgb(123, 76, 161) solid;
  border-left: 3px rgb(123, 76, 161) solid;
  border-right: 3px rgb(123, 76, 161) solid;
}

/* 👇 예산(Budget)에는 영향이 가지 않도록 content-row에만 적용합니다 */
.content-row {
  align-items: stretch !important;
  /* 기둥 높이를 무조건 동일하게 맞춤 */
}

/* 달력과 목록이 공간을 100% 꽉 채우도록 강제 설정 */
.content-row>div>* {
  flex: 1;
  height: 100% !important;
  max-height: 650px !important;
  /* 여기서 650px로 절대 고정 */
}
</style>