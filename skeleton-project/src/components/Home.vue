<template>
  <div>
    <h1>가계부 기본 화면</h1>
    <Header @user-logout="emit('user-logout')" />
    <Budget />
    <div>
      <router-view></router-view>
      <router-view name="right"></router-view>
    </div>
  </div>
</template>
<script setup>
import Calender from '@/components/Calender.vue';
import Budget from './Budget.vue';
import Header from './Header.vue';
import MoneyList from './MoneyList.vue';

const emit = defineEmits(['user-logout']);
</script>
