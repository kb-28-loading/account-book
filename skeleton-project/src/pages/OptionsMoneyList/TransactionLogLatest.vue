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

<!--
  ===== 변수명 용도 설명 =====

  [ref 상태 변수]
  - showCalendar  : 달력 팝업(date input 두 개)의 표시 여부를 제어. true이면 팝업이 열림.
  - activeFilter  : 현재 선택된 필터 버튼 상태를 추적. 'all' | 'weekly' | 'monthly' 중 하나.
                    버튼에 active 클래스를 동적으로 적용하는 데 사용됨.
  - showList      : TransactionLogList 컴포넌트의 렌더링 여부 제어.
                    v-if 바인딩에 사용되며, 조회 시 강제 재렌더링 트리거 역할도 함.
  - queryCount    : 조회 버튼을 누를 때마다 1씩 증가하는 카운터.
                    TransactionLogList의 :key에 바인딩되어, 값이 바뀔 때마다
                    자식 컴포넌트를 완전히 재생성(강제 리렌더)시킴.
  - startDate     : 날짜 범위 조회의 시작일. 'YYYY-MM-DD' 형식의 문자열.
                    달력 input v-model 및 자식 컴포넌트 props로 전달됨.
  - endDate       : 날짜 범위 조회의 종료일. 'YYYY-MM-DD' 형식의 문자열.
                    달력 input v-model 및 자식 컴포넌트 props로 전달됨.
  - showModal     : AddTransactionModal 컴포넌트의 표시 여부 제어.
                    true이면 거래 추가 모달이 열림.

  [const 함수 변수]
  - inputData     : 조회 실행 함수. showList를 true로 설정하고 queryCount를 1 증가시켜
                    TransactionLogList를 강제 재렌더링함. 여러 함수에서 공통으로 호출됨.
  - sortLatest    : '전체 내역' 버튼 클릭 핸들러. activeFilter를 'all'로 설정하고
                    startDate·endDate를 초기화한 뒤 inputData()를 호출해 전체 기간 조회.
  - formatDate    : Date 객체를 'YYYY-MM-DD' 문자열로 변환하는 유틸 함수.
                    toISOString() 사용 시 UTC+9 시차로 날짜가 하루 밀리는 문제를 피하기 위해
                    연·월·일을 직접 꺼내 조합함.
  - setWeekly     : '주간' 버튼 클릭 핸들러. 이번 주 일요일~토요일 범위를
                    startDate·endDate에 설정하고 inputData()를 호출.
  - setMonthly    : '월간' 버튼 클릭 핸들러. 이번 달 1일~말일 범위를
                    startDate·endDate에 설정하고 inputData()를 호출.
  - onModalClose  : AddTransactionModal의 @close 이벤트 핸들러.
                    모달을 닫고(showModal = false) inputData()를 호출해 목록을 갱신함.

  [formatDate 매개변수 및 내부 지역 변수]
  - date          : 변환할 Date 객체를 받는 매개변수.
  - ye            : date에서 추출한 연도(4자리 숫자).
  - mo            : date에서 추출한 월(2자리 문자열, 한 자리면 앞에 '0' 패딩).
  - da            : date에서 추출한 일(2자리 문자열, 한 자리면 앞에 '0' 패딩).

  [setWeekly 내부 지역 변수]
  - today         : 현재 날짜를 나타내는 Date 객체.
  - day           : today.getDay()로 얻은 요일 숫자(0=일요일 ~ 6=토요일).
                    이번 주 일요일을 계산하기 위한 오프셋으로 사용됨.
  - sunday        : 이번 주 일요일 날짜. today에서 day만큼 빼서 산출.
  - saturday      : 이번 주 토요일 날짜. sunday에 6일을 더해 산출.

  [setMonthly 내부 지역 변수]
  - today         : 현재 날짜를 나타내는 Date 객체.
  - year          : today에서 추출한 연도 숫자.
  - month         : today에서 추출한 월 인덱스(0~11). Date 생성자에 그대로 전달됨.
  - monthFirst    : 이번 달 1일을 나타내는 Date 객체.
  - monthLast     : 이번 달 마지막 날을 나타내는 Date 객체.
                    new Date(year, month + 1, 0) 으로 다음 달 0일(= 이번 달 말일)을 구함.
-->
