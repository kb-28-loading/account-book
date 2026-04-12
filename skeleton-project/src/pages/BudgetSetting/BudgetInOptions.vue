<template>
  <div class="budget-management-page mb-5">
    <header class="header">
      <h2 class="title">예산관리 <span class="sub-title">예산설정</span></h2>
      <hr class="title-underline" />
    </header>

    <div class="month-selector">
      <button @click="changeMonth(-1)" class="nav-btn">&larr;</button>
      <span class="current-month">{{ month }}월</span>
      <button @click="changeMonth(1)" class="nav-btn">&rarr;</button>
    </div>

    <div class="options-main-container">
      <div class="total-budget-row">
        <label>전체예산 : </label>
        <input
          type="text"
          v-model.number="savedTotalAmount"
          placeholder="0"
          class="total-input"
        />
        <span>원</span>
      </div>

      <hr class="inner-line" />

      <div class="category-grid">
        <div
          v-for="catName in allCategories"
          :key="catName"
          class="category-item"
        >
          <div class="cat-label">{{ catName }} :</div>
          <input
            type="number"
            v-model.number="budgetInputs[catName]"
            class="cat-input"
            placeholder="0"
          />
        </div>
      </div>

      <div class="button-wrapper">
        <button @click="saveBudget" class="complete-btn">설정 완료</button>
      </div>
    </div>

    <div v-if="currentTotalDisplay > 0" class="status-info">
      현재 카테고리 합계: {{ currentTotalDisplay.toLocaleString() }}원
    </div>

    <div v-if="moneyListFiltered.length > 0" class="history-section">
      <h4>{{ month }}월 거래 내역 (필터링됨)</h4>
      <ul class="history-list">
        <li v-for="item in moneyListFiltered" :key="item.id">
          {{ item.date }} | {{ item.name }} :
          {{ item.amount.toLocaleString() }}원
        </li>
      </ul>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/login';

const loginStore = useLoginStore();

const date = new Date();
const month = ref(date.getMonth() + 1);
const year = ref(date.getFullYear());

const moneyList = ref([]);
const moneyListFiltered = ref([]);
const allCategories = ref([]);
const budgetInputs = ref({});
const budgetCategory = ref({});
const savedTotalAmount = ref(0);

// 월 변경 함수 (1월 미만이나 12월 초과 시 연도 조절)
const changeMonth = (delta) => {
  month.value += delta;
  if (month.value < 1) {
    month.value = 12;
    year.value -= 1;
  } else if (month.value > 12) {
    month.value = 1;
    year.value += 1;
  }
  reportDate(month.value, year.value);
};

const reportDate = (m, y) => {
  let settingDate = `${y}-${m.toString().padStart(2, '0')}`;
  moneyListFiltered.value = moneyList.value.filter(
    (item) => item.date && item.date.startsWith(settingDate),
  );
};

const currentTotalDisplay = computed(() => {
  return Object.values(budgetInputs.value).reduce(
    (acc, cur) => acc + (Number(cur) || 0),
    0,
  );
});

const fetchData = async () => {
  if (!loginStore.user?.id) return;
  try {
    const catResp = await axios.get('http://localhost:3000/outcome-category');
    allCategories.value = catResp.data;

    // 만약 실제 거래내역 API가 있다면 여기서 호출
    // const moneyResp = await axios.get("http://localhost:3000/moneyList");
    // moneyList.value = moneyResp.data;

    reportDate(month.value, year.value);

    const userResp = await axios.get(
      `http://localhost:3000/users/${loginStore.user.id}`,
    );
    const userData = userResp.data;

    if (userData.userBudget && userData.userBudget.length > 0) {
      const latestData = userData.userBudget[userData.userBudget.length - 1];
      savedTotalAmount.value = latestData.budgetTot || 0;
      allCategories.value.forEach((catName) => {
        budgetInputs.value[catName] = latestData.budgetCategory[catName] || 0;
      });
    }
  } catch (err) {
    console.error('데이터 로드 실패', err);
  }
};

const saveBudget = () => {
  let tempTotal = currentTotalDisplay.value;

  if (tempTotal > savedTotalAmount.value) {
    alert(`합계(${tempTotal.toLocaleString()}원)가 전체 예산을 초과합니다!`);
    return;
  }

  // 실제 저장 로직 (Axios post 등 필요 시 추가)
  // 최종적으로 서버에 넘길 객체 형식 지정
  const budgetSet = {
    budgetYearMonth: settingDate,
    budgetTot: savedTotalAmount,
    budgetCategory: budgetInputs,
  };
  alert(`${month.value}월 예산 설정이 완료되었습니다.`);
  console.log('예산 객체', budgetSet);
};

// 월이 바뀔 때마다 데이터를 다시 필터링하도록 감시
watch([month, year], () => {
  reportDate(month.value, year.value);
});

onMounted(fetchData);
</script>

<style scoped>
/* 전체 레이아웃 */
.budget-management-page {
  max-width: 600px;
  margin: 0 auto;
  padding: 20px;
  font-family: 'Malgun Gothic', sans-serif;
  color: #4a2d6d; /* 보라색 계열 */
}

/* 헤더 */
.header .title {
  font-size: 24px;
  font-weight: bold;
}
.header .sub-title {
  font-size: 18px;
  margin-left: 10px;
}
.title-underline {
  border: 0;
  height: 2px;
  background-color: #7b5aa6;
  margin-top: 10px;
}

/* 월 선택기 */
.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 15px 0;
  font-size: 20px;
  font-weight: bold;
}
.nav-btn {
  background: none;
  border: none;
  font-size: 24px;
  color: #7b5aa6;
  cursor: pointer;
}

/* 메인 박스 */
.options-main-container {
  border: 2px solid #d1c4e9;
  border-radius: 20px;
  padding: 30px;
  background-color: #fff;
}

.total-budget-row {
  font-size: 20px;
  font-weight: bold;
  margin-bottom: 10px;
}
.total-input {
  border: none;
  border-bottom: 1px solid #ccc;
  width: 150px;
  font-size: 18px;
  text-align: right;
  outline: none;
}

.inner-line {
  border: 0.5px solid #eee;
  margin: 20px 0;
}

/* 카테고리 그리드 배치 (2열) */
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr; /* 2열로 나눔 */
  gap: 20px 40px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cat-label {
  font-weight: bold;
  flex-shrink: 0;
}

.cat-input {
  border: none;
  border-bottom: 1px solid #ddd;
  width: 80px;
  text-align: right;
  outline: none;
}

/* 버튼 */
.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 30px;
}
.complete-btn {
  background-color: #b39ddb;
  color: white;
  border: none;
  padding: 8px 16px;
  border-radius: 12px;
  cursor: pointer;
  font-size: 16px;
}
.complete-btn:hover {
  background-color: #9575cd;
}

/* 하단 내역 */
.status-info {
  margin-top: 15px;
  text-align: center;
  color: #888;
}
.history-section {
  margin-top: 30px;
  background: #f9f9f9;
  padding: 15px;
  border-radius: 10px;
}
.history-list {
  list-style: none;
  padding: 0;
}
.history-list li {
  padding: 5px 0;
  border-bottom: 1px solid #eee;
  font-size: 14px;
}
</style>
