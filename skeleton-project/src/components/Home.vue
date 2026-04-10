<template>
  <div>
    <h1>가계부 기본 화면</h1>
    <Header
      @user-logout="emit('user-logout')"
      @go-home="emit('go-home')"
      @go-options-transaction="emit('go-options-transaction')"
      @go-options-budget="emit('go-options-budget')"
    />
    <Budget />
    <div>
      <router-view></router-view>
      <router-view name="right"></router-view>
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
]);
</script>
