<template>
  <div class="header">
    <img src="@/assets/mainLogo.jpg" alt="메인 로고" />
    <div class="buttons">
      <span class="text-danger" @click.stop="emit('user-logout')"
        >로그아웃</span
      >
      <RightNavBar
        @go-home="emit('go-home')"
        @go-options-transaction="goTransaction"
        @go-options-budget="goBudget"
      />
    </div>
  </div>
</template>
<script setup>
import RightNavBar from './RightNavBar.vue';
import { ref } from 'vue';

const emit = defineEmits([
  'user-logout',
  'go-home',
  'go-options-transaction',
  'go-options-budget',
]);

// transaction으로 이동
const goTransaction = () => {
  emit('go-options-transaction');
};

// 예산 확인 페이지로 이동
const goBudget = () => {
  emit('go-options-budget');
};
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  background-color: white;
  height: 60px;
}
img {
  width: 113px;
  height: 59.7px;
  border-radius: 60px;
}
.buttons {
  display: flex;
  align-items: center;
}
</style>
