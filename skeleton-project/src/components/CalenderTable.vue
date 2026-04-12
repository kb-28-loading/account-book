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

console.log(today);
// 오늘 날짜에 대한 데이터를 today에 넣기
// (Tue Apr 07 2026 23:02:31 GMT+0900 (한국 표준시))

const year = ref(today.getFullYear());
console.log(year); /* 2026 */
// 오늘에 대한 데이터에서 년에 대한 데이터 반환

const month = ref(today.getMonth());
console.log(month); /* 3(4월) */
// 오늘에 대한 데이터에서 월에 대한 데이터 반환
// -> 하지만 JS에서는 getMonth를 사용할경우(0~11)으로 반환 (0=1월)~(11=12월)

// ===============================================================================
// 1-2. 달력 만들기 (변경 사항 있을때마다 로드)

// 요일 배열
const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];

const calenderData = computed(() => {
  // ===============================================================================
  // 1-3. 이번달 시작점과 끝지점 구하기
  const firstDay = new Date(year.value, month.value, 1).getDay();
  // 이번 달의 첫날 요일 (0: 일요일, 1: 월요일...)
  // new Date(2026, 3, 1).getDay()   4월 1일은 무슨 요일인가?   3(수요일)
  // **getDay()**는 요일(일~토)을 숫자로 가져오고,

  const lastDate = new Date(year.value, month.value + 1, 0).getDate();
  // 이번 달의 마지막 날짜
  // new Date(2026, 4, 0).getDate()   4월의 마지막 날짜는 며칠인가?   30(30일)
  // +1달을 하는 이유 -> 해당 달의 언제가 마지막인지 다달라서 다음달의 0일로 출력
  // **getDate()**는 날짜(1~31)를 숫자로 가져옵니다.

  // ================================================================================
  // 2. 달력 만들기

  let dates = [];
  // 전체 달력 (주 단위 배열들을 모아놓을 2차원 배열) 

  let week = [];
  // 한 주 (7개의 칸을 담는 1차원 배열) 

  // 2-1. 1일 이전을 빈칸으로 채우기
  for (let i = 0; i < firstDay; i++) {
    week.push('');
  }

  // 2-2. 달력배열(dates[]) 채우기
  for (let i = 1; i <= lastDate; i++) {
    // 1일부터 당월을 다 채울 때까지 진행

    week.push(i);

    if (week.length === 7) {
      // 주단위 달력이 7칸이 다 차면 작동

      dates.push(week);
      // 전체달력에 주단위 달력 추가

      week = [];
      // 사용후 주단위 달력 비우기
    }
  }

  // 2-3. 막주 채우기
  if (week.length > 0) {
    // 당월을 다 채우고 나왔는데 마지막 주가 7칸을 다 채우지 못하고 남아 있을 경우

    while (week.length < 7) week.push('');
    // 남은 칸 만큼 빈칸 넣기 반복

    dates.push(week);
    // 빈칸까지 다 차면 마지막 주 단위 넣기
  }
  return dates;
});
// ================================================================
// 데이터를 날짜별로 묶어서 수입 지출의 합계를 계산

const dailyMoney = computed(() => {
  const summary = {};

  // userMoneyList의 개수만큼 i를 0부터 1씩 늘리면서 반복
  for (let i = 0; i < moneyStore.userMoneyList.length; i++) {

    const item = moneyStore.userMoneyList[i];

    // console.log(i, "번째 item값", item);
    // console.log("번째 item값", item.date);


    // 1. 장부에 해당 날짜 칸이 없으면 새로 만듦
    if (!summary[item.date]) {
      summary[item.date] = { income: 0, outcome: 0 };
    }
    // summary는 객체임! 대괄호를 사용한건 key값이 date이기 때문에! date 예)2026-04-11
    //     // -> 이름에 '-'이 들어가면 '.'을 사용해서 가져올수 없음!
    // summary = { k : {} } 이 형태의 k:v값이 반복임

    // 2. 수입/지출에 따라 금액 더하기
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
        <div v-for="value in daysOfWeek" :key="value"
          class="col py-2 text-purple">
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
                <div v-if="dailyMoney[getFormattedDate(day)].income > 0" class="text-income big-money">
                  +{{ dailyMoney[getFormattedDate(day)].income.toLocaleString() }}
                </div>
                <div v-if="dailyMoney[getFormattedDate(day)].outcome > 0" class="text-outcome big-money">
                  -{{ dailyMoney[getFormattedDate(day)].outcome.toLocaleString() }}
                  <!-- 
                  날짜를 클릭 -> getFormattedDate()에서 '2026-04-20'이런식으로 해당값 반환
                  -> dailyMoney에 2026-04-20에 해당하는 value값 중 outcome, income에 해당하는 데이터를 줌
                  
                  toLocaleString() : 50000 -> 50,000으로 변환
                  -->
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
/* 메인 테두리 및 높이 */
.custom-border {
  border: 2px solid #BFA5D4 !important;
  border-radius: 20px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
}

.calendar-header {
  background-color: #BFA5D4 !important;
  padding: 1.2rem !important;
}

.header-title { color: #F3F7FF !important; }
.arrow-btn { cursor: pointer; color: #F3F7FF; transition: all 0.2s; }
.days-bg { background-color: #FEF2FC; }
.text-purple { color: #7b4ca1; }

/* 그리드 및 셀 설정 */
.calendar-grid {
  display: flex;
  flex-direction: column;
}

.cell-row {
  flex: 1; /* 5주든 6주든 남은 높이를 동일하게 나눠 가짐 */
  border-bottom: 1px solid #E1DAE5 !important;
}

.day-cell {
  border-right: 1px solid #E1DAE5 !important;
  position: relative;
}

.day-cell:last-child { border-right: none !important; }

/* 5. 👇 글자 크기 대폭 수정 */
.day-num {
  font-size: 1.3rem; /* 날짜 숫자 크게 (기존보다 약 1.3배) */
  color: #333;
  margin-bottom: 2px;
}

.big-money {
  font-size: 13px; /* 수입/지출 글자 크게 (기존 10px -> 13px) */
  font-weight: 700;
  line-height: 1.2;
}

.text-income { color: #0d6efd; }
.text-outcome { color: #dc3545; }

.day-link:hover { background-color: #FEF2FC; }
.bg-empty { background-color: #fafafa; }

/* 주차별 높이 비율 (6주 대비) */
.h-20 { min-height: 16.66%; } 
</style>