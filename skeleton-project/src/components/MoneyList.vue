<template>
  <div>
    <h3>거래 내역 확인</h3>
    <router-view></router-view>
  </div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';
const loginStore = useLoginStore();
console.log(loginStore.user);
</script>
