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
// 1. 오늘 날짜의 데이터를 담기
const today = new Date();

console.log(today);
// 오늘 날짜에 대한 데이터를 today에 넣기
// (Tue Apr 07 2026 23:02:31 GMT+0900 (한국 표준시))

const year = ref(today.getFullYear());
console.log(year); /* 2026 */
// 오늘에 대한 데이터에서 년에 대한 데이터 반환

const month = ref(today.getMonth());
console.log(month); /* 3 */
// 오늘에 대한 데이터에서 월에 대한 데이터 반환
// -> 하지만 JS에서는 getMonth를 사용할경우(0~11)으로 반환 (0=1월)~(11=12월)

// ===============================================================================
// 1. 달력 만들기 (변경 사항 있을때마다 로드)

const daysOfWeek = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
const calenderData = computed(() => {
  // ===============================================================================
  // 1-1. 이번달 시작점과 끝지점 구하기
  const firstDay = new Date(year.value, month.value, 1).getDay();
  // 이번 달의 첫날 요일 (0: 일요일, 1: 월요일...)
  // new Date(2026, 3, 1).getDay()   4월 1일은 무슨 요일인가?   3(수요일)
  // **getDay()**는 요일(일~토)을 숫자로 가져오고,

  const lastDate = new Date(year.value, month.value + 1, 0).getDate();
  // 이번 달의 마지막 날짜
  // new Date(2026, 4, 0).getDate()   4월의 마지막 날짜는 며칠인가?   30(30일)
  // **getDate()**는 날짜(1~31)를 숫자로 가져옵니다.

  // ================================================================================
  // 2. 달력 만들기
  // 요일 배열

  let dates = [];
  // 전체 달력 (주 단위 배열들을 모아놓은 2차원 배열) 

  let week = [];
  // 한 주 (7개의 칸을 담는 1차원 배열) 

  // 2-1. 1일 이전을 빈칸으로 채우기
  for (let i = 0; i < firstDay; i++) {
    week.push('');
  }

  // 2-2. 달력 채우기
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
    // 당월을 다 채우고 나왔는데 마지막 주가 7칸을 다 채우지 못하고 '남아' 있을 경우

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
    console.log("asdasd", item.date);


    // 1. 장부에 해당 날짜 칸이 없으면 새로 만듦
    if (!summary[item.date]) {
      summary[item.date] = { income: 0, outcome: 0 };
    }
    // summary는 객체임! 대괄호를 사용한건 key값이 date이기 때문에!
    // -> 이름에 '-'이 들어가면 '.'을 사용해서 가져올수 없음!
    // 때문에 summary = { k : {} } 이 형태의 k:v값이 반복임

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
  <div>
    <h1>{{ year }}년 {{ month + 1 }}월
      <div class="month-select row">
        <div class="col">
          <i class="fa-solid fa-arrow-left left-arrow" @click="changeMonth(-1)"></i>
        </div>
        <div class="col selected-month"></div>
        <div class="col">
          <i class="fa-solid fa-arrow-right right-arrow" @click="changeMonth(+1)"></i>
        </div>
      </div>
    </h1>
    <!-- JS에서는 getMonth()는 0~11만 반환 -> 함수 진행에는 문제 없지만 출력에는
    1적게 출력되므로 +1 -->

    <table border="1">
      <!-- 표에 선 만들기 -->
      <tbody>
        <tr>
          <th v-for="value in daysOfWeek" :key="value">{{ value }}</th>
          <!-- 요일 배열 가져다가 넣기 -->
        </tr>

        <tr v-for="(week, index) in calenderData" :key="index">
          <!-- tr : 행 만들기 dates배열의 week 수만큼 반복(키는 index) -->

          <td v-for="(day, dayIndex) in week" :key="dayIndex">
            <router-link v-if="day" :to="{
              name: 'moneyListDaily',
              params: { selectedDate: getFormattedDate(day) },
            }">
              <div style="font-weight: bold;">{{ day }}</div>

              <div v-if="dailyMoney[getFormattedDate(day)]">
                <div v-if="dailyMoney[getFormattedDate(day)].income > 0" style="color: blue; font-size: 11px;">
                  +{{ dailyMoney[getFormattedDate(day)].income.toLocaleString() }}
                  <!-- 숫자 뒤에 .toLocaleString() 사용시 123123 -> 123,123 -->
                </div>
                <div v-if="dailyMoney[getFormattedDate(day)].outcome > 0" style="color: red; font-size: 11px;">
                  -{{ dailyMoney[getFormattedDate(day)].outcome.toLocaleString() }}
                </div>
              </div>
            </router-link>

            <span v-else></span>
            <!-- 만약 day가 ''이라면 -->
          </td>
        </tr>
      </tbody>
    </table>
  </div>
  <router-view></router-view>
</template>
<style scoped>
table {
  width: 60%;
  border-collapse: collapse;
  /* 테두리 사이 간격 제거 */
}

th,
td {
  border: 1px solid black;
  /* 명확한 검은색 줄 추가 */
  padding: 10px;
  text-align: center;
  vertical-align: top;
}
</style>
