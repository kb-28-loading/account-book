<template>
  <div class="budget-box">
    <!-- 1번 : 전체 박스 -->
    <div class="title">예산관리 <span class="sub">예산확인</span></div>
    <!-- 2번 : 제목 -->

    <div class="month-box">
      <!-- 3번 : 월 이동  -->
      <div class="budget-box"></div>
      <span class="arrow" @click="prevMonth">←</span>
      <span class="month-text">{{ month }}월</span>
      <span class="arrow" @click="nextMonth">→</span>
      <div class="budget-title">전체예산 :</div>
    </div>
  </div>
</template>

<script setup></script>
