<template>
  <!-- 전체를 감싸는 컨테이너 -->
  <div class="container">
    <!-- 헤더 -->
    <div>헤더</div>

    <!-- 주요 내용 -->
    <div class="main">
      <!-- 왼쪽 -->
      <div class="left-side">왼쪽</div>
      <!-- 오른쪽 -->
      <div class="right-side">
        <div>예산관리 예산설정</div>
        <div>0달</div>
        <div>
          <div>전체예산</div>
          <div>식비 : 1000</div>
          <div>식비 : 1000</div>
          <div>식비 : 1000</div>
          <div>식비 : 1000</div>
          <div>식비 : 1000</div>
        </div>
      </div>
    </div>

    <!-- 푸터 -->
    <div>푸터</div>
  </div>
</template>

<script setup></script>
<style scoped>
/* . : 클래스 / # : id  */
.container {
  width: 1440px;
}
.main {
  display: flex;
}
.left-side {
  width: 300px;
}
.right-side {
  width: 1100px;
}
div {
  border: 1px solid black;
}
</style>
