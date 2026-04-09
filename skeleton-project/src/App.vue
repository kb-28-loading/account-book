<template>
  <!-- <Practice /> -->
  <RouterLink :to="{ name: 'login' }">로그인</RouterLink>
  <RouterLink :to="{ name: 'home' }">홈</RouterLink>
  <RouterLink :to="{ name: 'options' }">옵션</RouterLink>
  <RouterView @login-success="goHome" @go-join="goJoin"></RouterView>
</template>

<script setup>
import Practice from './pages/BudgetSetting/Practice.vue';
import practice from './pages/BudgetSetting/Practice.vue';
import { useRouter } from 'vue-router';
const router = useRouter();

// 로그인 성공 시 보이는 화면을 '/home'으로 변경
const goHome = () => {
  // console.log('함수 실행');
  // console.log(router);
  router.replace('/home');
};

// 회원가입 페이지로 이동
const goJoin = () => {
  router.push('/join');
};
</script>

<style scoped></style>
