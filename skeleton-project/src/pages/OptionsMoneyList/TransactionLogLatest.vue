<template>
  <div>
    <div>
      <h1>거래 내역 조회</h1>
      <hr />
    </div>
    <div>
      <div @click=""><h5>최신순</h5></div>
      <div @click=""><h5>주간</h5></div>
      <div @click=""><h5>월간</h5></div>

      <!-- 날짜 표시 + 버튼 -->
      <div class="date-box">
        {{ startDate }} - {{ endDate }}
        <button @click="showCalendar = !showCalendar">📅</button>
        <button @click="inputData()">조회</button>
      </div>

      <!-- font awesome 적용 전 임시 -->
      <div>
        <!-- 달력 팝업 -->
        <div v-if="showCalendar">
          <input type="date" v-model="startDate" />
          <input type="date" v-model="endDate" />
        </div>
      </div>
    </div>
    <div>
      <TransactionLogList
        v-if="showList"
        :startDate="startDate"
        :endDate="endDate"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import TransactionLogList from "./TransactionLogList.vue";
const showCalendar = ref(false);
const showList = ref(false);
const inputData = () => {
  showList.value = true;
};

const startDate = ref("start");
const endDate = ref("end");
</script>
