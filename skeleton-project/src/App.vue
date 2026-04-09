<template>
  <RouterLink :to="{ name: 'login' }">로그인</RouterLink>
  <RouterView :to="{ name: 'home' }">홈</RouterView>
  <RouterView :to="{ name: 'options' }">옵션</RouterView>
  <RouterView></RouterView>
</template>

<<<<<<< HEAD
<script setup>
import Home from "./components/Home.vue";
import Login from "./components/Login.vue";
import Options from "./components/Options.vue";
import Join from "./components/Join.vue";
import TransactionLogLatest from "./pages/OptionsMoneyList/TransactionLogLatest.vue";
</script>
=======
<script setup></script>
>>>>>>> fbb909b29e50b2b4b98fba1a59e41c97c86558dc

<style scoped></style>
