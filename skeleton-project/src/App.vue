<template>
  <RouterLink :to="{ name: 'login' }">로그인</RouterLink>
  <RouterView :to="{ name: 'home' }">홈</RouterView>
  <RouterView :to="{ name: 'options' }">옵션</RouterView>
  <RouterView></RouterView>
</template>

<script setup></script>

<style scoped></style>
