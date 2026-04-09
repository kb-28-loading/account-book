<template>
  <div>
    <h1>거래 내역 조회</h1>
    <hr />
    <h3>최신순</h3>
    <h3>주간</h3>
    <h3>월간</h3>
    <div>
      <!-- 날짜 표시 + 버튼 -->
      <span>-</span>
      <button @click="showCalendar = !showCalendar">📅</button>

      <!-- 달력 팝업 -->
      <div v-if="showCalendar">
        <input type="date" v-model="startDate" />
        <input type="date" v-model="endDate" />
      </div>
    </div>
  </div>
</template>
<script setup></script>
