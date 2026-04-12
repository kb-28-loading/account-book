<template>
  <div>
    <div>
      <h1>거래 내역 조회(DATE)</h1>
      <hr />
    </div>
    <div>
      <div @click="sortLatest"><button>전체 내역</button></div>
      <div @click="setWeekly"><button>주간</button></div>
      <div @click="setMonthly"><button>월간</button></div>

      <!-- 날짜 표시 + 버튼 -->
      <div class="date-box">
        {{ startDate && endDate ? `${startDate} ~ ${endDate}` : "전체 기간" }}
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
        :key="queryCount"
      />
    </div>
    <div>
      <button @click="showModal = true">+</button>
      <AddTransactionModal v-if="showModal" @close="onModalClose" />
    </div>
  </div>
</template>
<script setup>
import AddTransactionModal from "@/components/AddTransactionModal.vue"; // 자식 가져오기
import { ref } from "vue";
import TransactionLogList from "./TransactionLogList.vue";

const showCalendar = ref(false);
const showList = ref(true);
const queryCount = ref(0);
const startDate = ref("");
const endDate = ref("");
const showModal = ref(false);

const inputData = () => {
  showList.value = true;
  queryCount.value++;
  console.log(showList.value);
};

const sortLatest = () => {
  startDate.value = "";
  endDate.value = "";
  inputData();
};
// formatDate() -> 한국 기준시간이 UTC+9인 관계로 toISOString 문법 사용 시 기간 설정 오류로 인해 직접 꺼내서 조합
const formatDate = (date) => {
  const ye = date.getFullYear();
  const mo = String(date.getMonth() + 1).padStart(2, "0");
  const da = String(date.getDate()).padStart(2, "0");
  return `${ye}-${mo}-${da}`;
};

const setWeekly = () => {
  const today = new Date();
  const day = today.getDay();
  // -> getday로
  // 0 = 일요일
  // 1 = 월요일
  // 2 = 화요일
  // 3 = 수요일
  // 4 = 목요일
  // 5 = 금요일
  // 6 = 토요일
  console.log(day);

  const sunday = new Date(today);
  sunday.setDate(today.getDate() - day);

  const saturday = new Date(sunday);
  saturday.setDate(sunday.getDate() + 6);

  startDate.value = formatDate(sunday);
  endDate.value = formatDate(saturday);
  inputData();
};

const setMonthly = () => {
  const today = new Date();
  const year = today.getFullYear();
  const month = today.getMonth();

  const monthFirst = new Date(year, month, 1);
  const monthLast = new Date(year, month + 1, 0);

  startDate.value = formatDate(monthFirst);
  endDate.value = formatDate(monthLast);
  inputData();
};
const onModalClose = () => {
  showModal.value = false;
  inputData();
};
// ---------------------------------------------
</script>
