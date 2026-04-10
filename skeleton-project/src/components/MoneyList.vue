<template>
  <div>
    <h3>거래 내역 확인</h3>
    <router-link :to="{ name: 'moneyListLatest' }">최신순 </router-link>
    <router-view name="right"></router-view>
  </div>
</template>
<script setup></script>
