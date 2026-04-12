<template>
  <div>
    <div>
      <h1>거래 내역 조회(DATE)</h1>
      <hr class="title-underline" />
    </div>
    <div class="controls-bar">
      <button
        class="filter-btn"
        :class="{ active: activeFilter === 'all' }"
        @click="sortLatest"
      >
        전체 내역
      </button>
      <button
        class="filter-btn"
        :class="{ active: activeFilter === 'weekly' }"
        @click="setWeekly"
      >
        주간
      </button>
      <button
        class="filter-btn"
        :class="{ active: activeFilter === 'monthly' }"
        @click="setMonthly"
      >
        월간
      </button>

      <!-- 날짜 표시 + 버튼 -->
      <div class="date-box">
        <span>{{
          startDate && endDate ? `${startDate} - ${endDate}` : "전체 기간"
        }}</span>
        <button @click="showCalendar = !showCalendar">📅</button>
        <button class="query-btn" @click="inputData()">조회</button>
      </div>

      <!-- 달력 팝업 -->
      <div v-if="showCalendar" class="calendar-popup">
        <input type="date" v-model="startDate" />
        <input type="date" v-model="endDate" />
      </div>
    </div>
    <div class="options-main-container">
      <TransactionLogList
        v-if="showList"
        :startDate="startDate"
        :endDate="endDate"
        :key="queryCount"
      />
      <div class="add-btn-wrapper">
        <button class="add-btn" @click="showModal = true">+</button>
      </div>
      <AddTransactionModal v-if="showModal" @close="onModalClose" />
    </div>
  </div>
</template>
<script setup>
import AddTransactionModal from "@/components/AddTransactionModal.vue"; // 자식 가져오기
import { ref } from "vue";
import TransactionLogList from "./TransactionLogList.vue";

const showCalendar = ref(false);
const activeFilter = ref("all");
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
  activeFilter.value = "all";
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
  activeFilter.value = "weekly";
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
  activeFilter.value = "monthly";
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
<style scoped>
.controls-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-btn {
  border: 1.5px solid #bfa5d4;
  border-radius: 999px;
  background: white;
  padding: 6px 18px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  color: #3d3d3d;
}

.filter-btn:hover {
  background-color: #f3eeff;
}

.filter-btn.active {
  background-color: #bfa5d4;
  color: white;
  border-color: #bfa5d4;
}

.date-box {
  display: flex;
  align-items: center;
  gap: 8px;
  margin-left: auto;
  font-size: 14px;
  color: #3d3d3d;
}

.query-btn {
  border: none;
  border-radius: 999px;
  background-color: #bfa5d4;
  color: white;
  padding: 6px 16px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
}

.query-btn:hover {
  background-color: #a98bc4;
}

.calendar-popup {
  display: flex;
  gap: 8px;
  align-items: center;
}

.add-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0;
}

.add-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background-color: #bfa5d4;
  color: white;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.add-btn:hover {
  background-color: #a98bc4;
}
</style>
