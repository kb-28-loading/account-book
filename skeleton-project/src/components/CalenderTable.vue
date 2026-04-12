<script setup>
import { ref, onMounted, computed } from 'vue'
import { useMoneyStore } from '@/stores/money';

const moneyStore = useMoneyStore();
// ==================================================================
// db.json 값 가져오기(pinia)
onMounted(() => {
  moneyStore.loadData();
});
// =====================================================================
// 1-1. 오늘 날짜의 년, 월을 담기
const today = new Date();

const year = ref(today.getFullYear());
const month = ref(today.getMonth());

// ===============================================================================
// 1-2. 달력 만들기 (변경 사항 있을때마다 로드)
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calenderData = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay();
  const lastDate = new Date(year.value, month.value + 1, 0).getDate();

  let dates = [];
  let week = [];

  for (let i = 0; i < firstDay; i++) {
    week.push('');
  }

  for (let i = 1; i <= lastDate; i++) {
    week.push(i);
    if (week.length === 7) {
      dates.push(week);
      week = [];
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push('');
    dates.push(week);
  }
  return dates;
});

// ================================================================
// 데이터를 날짜별로 묶어서 수입 지출의 합계를 계산
const dailyMoney = computed(() => {
  const summary = {};

  for (let i = 0; i < moneyStore.userMoneyList.length; i++) {
    const item = moneyStore.userMoneyList[i];

    if (!summary[item.date]) {
      summary[item.date] = { income: 0, outcome: 0 };
    }

    if (item.type === "수입") {
      summary[item.date].income += item.userMoney;
    } else {
      summary[item.date].outcome += item.userMoney;
    }
  }

  return summary;
});

// ===========================================================================
// 월 바꾸기
const changeMonth = (diff) => {
  const date = new Date(year.value, month.value + diff, 1);
  year.value = date.getFullYear();
  month.value = date.getMonth();
};
const getFormattedDate = (day) => {
  if (!day) return '';
  const fMonth = String(month.value + 1).padStart(2, '0');
  const fDay = String(day).padStart(2, '0');
  return `${year.value}-${fMonth}-${fDay}`;
};
</script>

<template>
  <div class="card shadow-sm calendar-card mx-auto custom-border h-100">

    <div class="card-header border-bottom-0 calendar-header">
      <div class="d-flex justify-content-between align-items-center">
        <div class="arrow-btn" @click="changeMonth(-1)">
          <i class="fa-solid fa-arrow-left fa-xl"></i>
        </div>
        <h3 class="fw-bold m-0 header-title">{{ year }}년 {{ month + 1 }}월</h3>
        <div class="arrow-btn" @click="changeMonth(1)">
          <i class="fa-solid fa-arrow-right fa-xl"></i>
        </div>
      </div>
    </div>

    <div class="card-body p-0 d-flex flex-column">
      <div class="row g-0 text-center border-bottom days-bg fw-bold days-header">
        <div v-for="value in daysOfWeek" :key="value" class="col py-2 text-purple">
          {{ value }}
        </div>
      </div>

      <div class="calendar-grid flex-grow-1">
        <div v-for="(week, index) in calenderData" :key="index" class="row g-0 text-center border-bottom cell-row h-20">
          <div v-for="(day, dayIndex) in week" :key="dayIndex" class="col day-cell p-1 border-end">

            <router-link v-if="day" :to="{
              name: 'moneyListDaily',
              params: { selectedDate: getFormattedDate(day) },
            }" class="text-decoration-none text-dark d-block h-100 p-1 rounded day-link">

              <div class="fw-bold day-num">{{ day }}</div>

              <div v-if="dailyMoney[getFormattedDate(day)]" class="money-box">
                <div v-if="dailyMoney[getFormattedDate(day)].income > 0" class="text-income big-money"
                  :title="'+' + dailyMoney[getFormattedDate(day)].income.toLocaleString()">
                  +{{ dailyMoney[getFormattedDate(day)].income.toLocaleString() }}
                </div>
                <div v-if="dailyMoney[getFormattedDate(day)].outcome > 0" class="text-outcome big-money"
                  :title="'-' + dailyMoney[getFormattedDate(day)].outcome.toLocaleString()">
                  -{{ dailyMoney[getFormattedDate(day)].outcome.toLocaleString() }}
                </div>
              </div>
            </router-link>
            <div v-else class="h-100 bg-empty"></div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<style scoped>
/* 1. 전체 달력 컨테이너 (테마 및 높이) */
.custom-border {
  border: 2px solid #BFA5D4 !important;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  /* 👇 칸 높이가 더 줄었으므로 전체 높이도 700px -> 650px로 콤팩트하게 맞춥니다 */
  height: 650px;
}

/* 2. 상단 헤더 (연월 및 화살표) */
.calendar-header {
  background-color: #BFA5D4 !important;
  padding: 1.2rem !important;
  flex-shrink: 0;
}

.header-title {
  color: #F3F7FF !important;
}

.arrow-btn {
  cursor: pointer;
  color: #F3F7FF;
  transition: transform 0.2s;
}

.arrow-btn:hover {
  transform: scale(1.2);
}

/* 3. 요일 표시 영역 */
.days-bg {
  background-color: #FEF2FC;
}

.text-purple {
  color: #7b4ca1;
}

/* 4. 날짜 그리드 영역 (틈새 제거 완벽 적용) */
.calendar-grid {
  display: flex;
  flex-direction: column;
  flex: 1;
  table-layout: fixed;
}

.cell-row {
  display: flex;
  flex: 1;
  /* 👇 핵심: 이전 100px의 90%인 90px로 줄여서 칸을 더 얇게 만듭니다 */
  min-height: 90px;
  border-bottom: none !important;
}

.day-cell {
  flex: 1;
  border-bottom: 1px solid #E1DAE5 !important;
  border-right: 1px solid #E1DAE5 !important;
  background-color: white;
  padding: 0 !important;
  position: relative;
  min-width: 0;
}

.day-cell:last-child {
  border-right: none !important;
}

.calendar-grid>.cell-row:last-child .day-cell {
  border-bottom: none !important;
}

/* 5. 날짜 내부 요소 (빈틈없이 꽉 채우기) */
.day-link {
  display: flex;
  flex-direction: column;
  justify-content: flex-start;
  width: 100%;
  height: 100%;
  padding: 8px !important;
  box-sizing: border-box;
  overflow: hidden;
}

.day-link:hover {
  background-color: #FEF2FC;
}

.bg-empty {
  width: 100%;
  height: 100%;
  background-color: #fafafa;
  margin: 0;
}

/* 6. 글자 및 텍스트 스타일 */
.day-num {
  font-size: 1.2rem;
  font-weight: bold;
  color: #333;
  margin-bottom: 3px;
}

.money-box {
  display: flex;
  flex-direction: column;
  gap: 1px;
  width: 100%;
}

.big-money {
  font-size: 12px;
  font-weight: 700;
  line-height: 1.2;
  white-space: nowrap;

  /* 숫자가 길어지면 ... 으로 처리 (유지) */
  overflow: hidden;
  text-overflow: ellipsis;
  display: block;
  max-width: 100%;
}

.text-income {
  color: #0d6efd;
}

.text-outcome {
  color: #dc3545;
}
</style>