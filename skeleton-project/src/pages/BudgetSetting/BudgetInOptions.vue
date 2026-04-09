<template>
  <div class="budget-box">
    <!-- 1번 : 전체 박스 -->
    <div class="title">예산관리 <span class="sub">예산설정</span></div>
    <!-- 2번 : 제목 -->

    <div class="month-box">
      <!-- 3번 : 월 이동  -->
      <div class="budget-box"></div>
      <span class="arrow" @click="prevMonth">←</span>
      <span class="month-text">{{ month }}월</span>
      <span class="arrow" @click="nextMonth">→</span>
      <div class="budget-title">전체예산 :</div>

      <div class="budget-box"></div>
      <!-- 4번 : 전체예산 -->
      <div class="budget-title">전체예산:</div>

      <div class="budget-content">
        식비 : <input type="number" v-model="budget.food" /><br /><br />
        주거/통신 : <input type="number" v-model="budget.housing" /><br /><br />
        생활 : <input type="number" v-model="budget.life" /><br /><br />
        온라인쇼핑 :
        <input type="number" v-model="budget.shopping" /><br /><br />
        카페/간식 : <input type="number" v-model="budget.cafe" /><br /><br />
        교통 : <input type="number" v-model="budget.transport" />
      </div>

      <div class="right">문화/여가 : <input v-model="budget.culture" /></div>
    </div>
  </div>

  <div class="button-box">
    <button @click="setting">설정완료</button>
  </div>
</template>
<script setup>
import { ref } from "vue";

const budget = ref({
  food: 0,
  housing: 0,
  life: 0,
  shopping: 0,
  cafe: 0,
  transport: 0,
});
</script>
