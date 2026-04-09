<template>
  <RouterLink :to="{ name: 'login' }">로그인</RouterLink>
  <RouterLink :to="{ name: 'home' }">홈</RouterLink>
  <RouterLink :to="{ name: 'options' }">옵션</RouterLink>
  <RouterView></RouterView>
</template>

<script setup>
import Home from './components/Home.vue';
import Login from './components/Login.vue';
import Options from './components/Options.vue';
import Join from './components/Join.vue';
import TransactionLogLatest from './pages/OptionsMoneyList/TransactionLogLatest.vue';
</script>

<style scoped></style>
