<template>
  <div>
    <img src="@/assets/mainLogo.jpg" alt="메인 로고" />
    <RightNavBar />
  </div>
</template>
<script setup>
import RightNavBar from './RightNavBar.vue';
</script>
<style scoped>
div {
  display: flex;
  justify-content: space-between;
  background-color: white;
}
img {
  width: 113px;
  border-radius: 60px;
}
</style>
