<script setup>
import { ref, onMounted, computed } from 'vue';
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
// ref로 한 이유 -> 변화되는 값을 바로바로 담아야 해서

// ===============================================================================
// 1-2. 달력 만들기 (변경 사항 있을때마다 로드)
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calenderData = computed(() => {
  const firstDay = new Date(year.value, month.value, 1).getDay();
  // 해당 월의 1일이 무슨 요일(0:일~6:토)인지 계산
  const lastDate = new Date(year.value, month.value + 1, 0).getDate();
  // 타입이 수입이면 해당 날짜의 income에 더하고, 아니면 outcome에 더합니다.

  let dates = []; /* 전체 달력 배열 */
  let week = []; /* 주 배열 */

  // 1일 전 부분 빈칸으로 채우기
  for (let i = 0; i < firstDay; i++) {
    week.push('');
  }

  for (let i = 1; i <= lastDate; i++) {
    week.push(i);
    // 날짜 채워넣기
    if (week.length === 7) {
      /* 7일마다 dates 배열에 주 배열 넣기 */
      dates.push(week);
      week = []; /* 다시 채워 넣기 위해 배열 비우기 */
    }
  }

  if (week.length > 0) {
    while (week.length < 7) week.push('');
    /* 날짜를 다 채워도 남은 배열이 있을경우 빈칸 채우기*/
    dates.push(week);
    /* 다 채우고 dates 배열에 넣기 */
  }
  return dates;
});

// ================================================================
// 데이터를 날짜별로 묶어서 수입 지출의 합계를 계산(변화가 생길때마다 로드 & 실행)
const dailyMoney = computed(() => {
  const summary = {};

  for (let i = 0; i < moneyStore.userMoneyList.length; i++) {
    const item = moneyStore.userMoneyList[i];
    /* 거래내역 담기 */

    /* summary객체에 날짜key값으로 */
    if (!summary[item.date]) {
      // 해당 날짜에 지출 수입이 없을때
      summary[item.date] = { income: 0, outcome: 0 };
      // 지출 수입 value값 생성
    }

    /* 해당 날짜가 있을 경우 */
    if (item.type === '수입') {
      summary[item.date].income += item.userMoney;
      // 수입금액에 추가
    } else {
      summary[item.date].outcome += item.userMoney;
      // 지출금액에 추가
    }
  }

  return summary;
});

// ===========================================================================
// 월 바꾸기
const changeMonth = (diff) => {
  /* 클릭시 받는 이벤트값 사용 */
  const date = new Date(year.value, month.value + diff, 1);
  /* <누르면 (-1) >누르면 (+1)*/
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
      <div
        class="row g-0 text-center border-bottom days-bg fw-bold days-header"
      >
        <div
          v-for="value in daysOfWeek"
          :key="value"
          class="col py-2 text-purple"
        >
          {{ value }}
        </div>
      </div>

      <div class="calendar-grid flex-grow-1">
        <div
          v-for="(week, index) in calenderData"
          :key="index"
          class="row g-0 text-center border-bottom cell-row h-20"
        >
          <div
            v-for="(day, dayIndex) in week"
            :key="dayIndex"
            class="col day-cell p-1 border-end"
          >
            <router-link
              v-if="day"
              :to="{
                name: 'moneyListDaily',
                params: { selectedDate: getFormattedDate(day) },
              }"
              class="text-decoration-none text-dark d-block h-100 p-1 rounded day-link"
            >
              <div class="fw-bold day-num">{{ day }}</div>

              <div v-if="dailyMoney[getFormattedDate(day)]" class="money-box">
                <div
                  v-if="dailyMoney[getFormattedDate(day)].income > 0"
                  class="text-income big-money"
                  :title="
                    '+' +
                    dailyMoney[getFormattedDate(day)].income.toLocaleString()
                  "
                >
                  +{{
                    dailyMoney[getFormattedDate(day)].income.toLocaleString()
                  }}
                </div>
                <div
                  v-if="dailyMoney[getFormattedDate(day)].outcome > 0"
                  class="text-outcome big-money"
                  :title="
                    '-' +
                    dailyMoney[getFormattedDate(day)].outcome.toLocaleString()
                  "
                >
                  -{{
                    dailyMoney[getFormattedDate(day)].outcome.toLocaleString()
                  }}
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
  border: 2px solid #bfa5d4 !important;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  background-color: white;
  height: 650px;
}

/* 2. 상단 헤더 (연월 및 화살표) */
.calendar-header {
  background-color: #bfa5d4 !important;
  padding: 1.2rem !important;
  flex-shrink: 0;
}

.header-title {
  color: #f3f7ff !important;
}

.arrow-btn {
  cursor: pointer;
  color: #f3f7ff;
  transition: transform 0.2s;
}

.arrow-btn:hover {
  transform: scale(1.2);
}

/* 3. 요일 표시 영역 */
.days-bg {
  background-color: #fef2fc;
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
  min-height: 90px;
  border-bottom: none !important;
}

.day-cell {
  flex: 1;
  border-bottom: 1px solid #e1dae5 !important;
  border-right: 1px solid #e1dae5 !important;
  background-color: white;
  padding: 0 !important;
  position: relative;
  min-width: 0;
}

.day-cell:last-child {
  border-right: none !important;
}

.calendar-grid > .cell-row:last-child .day-cell {
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
  background-color: #fef2fc;
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

  /* 숫자가 길어지면 ... 으로 처리  */
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
