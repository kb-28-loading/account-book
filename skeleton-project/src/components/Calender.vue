<script setup>
const today = new Date();

console.log(today);
// 오늘 날짜에 대한 데이터를 today에 넣기
// (Tue Apr 07 2026 23:02:31 GMT+0900 (한국 표준시))

const year = today.getFullYear();
console.log(year); /* 2026 */
// 오늘에 대한 데이터에서 년에 대한 데이터 반환

const month = today.getMonth();
console.log(month); /* 3 */
// 오늘에 대한 데이터에서 월에 대한 데이터 반환
// -> 하지만 JS에서는 getMonth를 사용할경우(0~11)으로 반환 (0=1월)~(11=12월)

const firstDay = new Date(year, month, 1).getDay();
// 1. 이번 달의 첫날 요일 (0: 일요일, 1: 월요일...)
// new Date(2026, 3, 1).getDay()   4월 1일은 무슨 요일인가?   3(수요일)
// **getDay()**는 요일(일~토)을 숫자로 가져오고,

const lastDate = new Date(year, month + 1, 0).getDate();
// 2. 이번 달의 마지막 날짜
// new Date(2026, 4, 0).getDate()   4월의 마지막 날짜는 며칠인가?   30(30일)
// **getDate()**는 날짜(1~31)를 숫자로 가져옵니다.

const daysOfWeek = ['일', '월', '화', '수', '목', '금', '토'];

let dates = [];
// 전체 달력 (주 단위 배열들을 모아놓은 2차원 배열)

let week = [];
// 한 주 (7개의 칸을 담는 1차원 배열)

for (let i = 0; i < firstDay; i++) {
  week.push('');
}
// 1일이 해당하는 위치 전에 빈칸 넣기

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

if (week.length > 0) {
  // 당월을 다 채우고 나왔는데 마지막 주가 7칸을 다 채우지 못하고 '남아' 있을 경우

  while (week.length < 7) week.push('');
  // 남은 칸 만큼 빈칸 넣기 반복

  dates.push(week);
  // 빈칸까지 다 차면 마지막 주 단위 넣기
}
</script>

<template>
  <div>
    <h1>{{ year }}년 {{ month + 1 }}월</h1>
    <!-- JS에서는 getMonth()는 0~11만 반환 -> 함수 진행에는 문제 없지만 출력에는
    1적게 출력되므로 +1 -->

    <table border="1">
      <!-- 표에 선 만들기 -->

      <tr>
        <th v-for="value in daysOfWeek" :key="value">{{ value }}</th>
      </tr>

      <tr v-for="(week, index) in dates" :key="index">
        <!-- tr : 행 만들기 dates배열의 week 수만큼 반복(키는 index) -->

        <td v-for="day in week" :key="day">
          <!-- 해당 week배열의 day 수만큼 반복(키는 day) -->

          <div>
            <span>{{ day }}</span>

            <div v-if="day">+ 312,323</div>

            <div v-if="day">- 12,323</div>
          </div>
          <!-- 칸마다 넣었던 day값 넣기 -->
        </td>
      </tr>
    </table>
  </div>
</template>
<style scoped>
table {
  width: 60%;
  border-collapse: collapse; /* 테두리 사이 간격 제거 */
}
th,
td {
  border: 1px solid black; /* 명확한 검은색 줄 추가 */
  padding: 10px;
  text-align: center;
  vertical-align: top;
}
span {
  text-align: left;
}
</style>
