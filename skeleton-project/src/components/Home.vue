<template>
  <div class="outer">
    <Header @user-logout="emit('user-logout')" @go-home="emit('go-home')"
      @go-options-transaction="emit('go-options-transaction')" @go-options-budget="emit('go-options-budget')"
      @go-options-report="emit('go-options-report')" />
    <div class="main-monitor">
      <Budget />
      <div class="row g-4 mt-3">
        <div class="col-lg-7">
          <router-view></router-view>
        </div>
        <div class="col-lg-5">
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
  padding: 40px 40px 60px; /* 이거 0 -> 60 */
  background-color: white;
  border-radius: 60px 60px 0 0;
  border-top: 3px rgb(123, 76, 161) solid;
  border-left: 3px rgb(123, 76, 161) solid;
  border-right: 3px rgb(123, 76, 161) solid;
}
.main-monitor > .row {
  align-items: stretch; /* 자식 요소들의 높이를 동일하게 맞춤 */
}
</style>
