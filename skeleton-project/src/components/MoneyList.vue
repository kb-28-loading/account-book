<template>
  <div>
    <h3>거래 내역 확인</h3>
    <router-link :to="{ name: 'moneyListLatest' }">최신순</router-link>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';
const loginStore = useLoginStore();
console.log(loginStore.user);
</script>
