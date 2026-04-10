<template>
  <div class="header">
    <img src="@/assets/mainLogo.jpg" alt="메인 로고" />
    <div class="buttons">
      <span class="text-danger" @click.stop="logout">로그아웃</span>
      <RightNavBar />
    </div>
  </div>
</template>
<script setup>
import RightNavBar from './RightNavBar.vue';

const emit = defineEmits(['user-logout']);

const logout = () => {
  emit('user-logout');
};
</script>
<style scoped>
.header {
  display: flex;
  justify-content: space-between;
  background-color: white;
}
img {
  width: 113px;
  border-radius: 60px;
}
.buttons {
  display: flex;
  align-items: center;
}
</style>
