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
      <Budget />
      <div>
        <router-view></router-view>
        <router-view name="right"></router-view>
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
  padding: 40px 40px 0;
  background-color: white;
  border-radius: 60px 60px 0 0;
  border-top: 3px rgb(123, 76, 161) solid;
  border-left: 3px rgb(123, 76, 161) solid;
  border-right: 3px rgb(123, 76, 161) solid;
}
</style>
