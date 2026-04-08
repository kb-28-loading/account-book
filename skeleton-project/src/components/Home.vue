<template>
  <div>
    <h1>가계부 기본 화면</h1>
    <Header />
    <Budget />
    <div>
      <Calender />
      <MoneyList />
    </div>
  </div>
</template>
<script setup>
import Calender from '@/components/Calender.vue';
import Budget from './Budget.vue';
import Header from './Header.vue';
import MoneyList from './MoneyList.vue';
</script>
