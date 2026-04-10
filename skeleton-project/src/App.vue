<template>
  <!-- <Practice /> -->
  <RouterLink :to="{ name: 'login' }">로그인</RouterLink>
  <RouterLink :to="{ name: 'home' }">홈</RouterLink>
  <RouterLink :to="{ name: 'options' }">옵션</RouterLink>
  <RouterView
    @login-success="goHome"
    @go-join="goJoin"
    @new-user="goLogin"
    @user-logout="userLogout"
  ></RouterView>
</template>

<script setup>
import Practice from './pages/BudgetSetting/Practice.vue';
import practice from './pages/BudgetSetting/Practice.vue';
import { useRouter } from 'vue-router';
import { useLoginStore } from './stores/login';
import { onMounted } from 'vue';

const router = useRouter();

// login.js에서 회원정보 받아오기
const loginStore = useLoginStore();

// 첫 화면으로 로그인 화면 노출, 이때 회원정보가 존재한다면, 홈 화면으로 이동
onMounted(() => {
  // console.log('마운트되었음');

  if (Object.keys(loginStore.user).length !== 0) {
    // console.log(1);
    router.replace('/home');
  } else {
    // console.log(2);
    router.push('/login');
  }
});

// 로그인 성공 시 보이는 화면을 '/home'으로 변경
const goHome = () => {
  // console.log('함수 실행');
  // console.log(router);

  // router.replace의 경우 이전화면 접근 불가. 뒤로가기를 통한 이동 제어
  router.replace('/home');
};

// 회원가입 페이지로 이동
const goJoin = () => {
  // 강제로 '/join'라우터로 이동
  router.push('/join');
};

// 회원가입 완료 시 로그인 창으로 이동
const goLogin = () => {
  router.replace('/login');
};

// 로그아웃 클릭 시 login.js내 회원정보 비운 뒤, 로그인 화면으로 이동
const userLogout = () => {
  loginStore.logout();
  router.replace('/login');
};
</script>

<style scoped></style>
