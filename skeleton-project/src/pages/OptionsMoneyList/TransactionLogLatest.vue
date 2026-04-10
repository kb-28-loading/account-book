<template>
  <div>
    <div>
      <h1>거래 내역 조회</h1>
      <hr />
    </div>
    <div>
      <div @click="sortLatest"><button>최신순</button></div>
      <div @click=""><button>주간</button></div>
      <div @click=""><button>월간</button></div>

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
        @latest="latest"
        :key="queryCount"
      />
    </div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import TransactionLogList from "./TransactionLogList.vue";
const latestData = ref();

const sortLatest = () => {
  latestData.value.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
};

const latest = (moneyList) => {
  latestData.value = moneyList.value;
  console.log(latestData.value);
};
const showCalendar = ref(false);
const showList = ref(false);
const queryCount = ref(0);

const inputData = () => {
  showList.value = true;
  queryCount.value++;
  console.log(showList.value);
};

const startDate = ref("yyyy - MM - dd");
const endDate = ref("yyyy - MM - dd");

// ---------------------------------------------
</script>
