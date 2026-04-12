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
        <label class="label-text">전체예산 : </label>
        <input
          type="text"
          v-model.number="savedTotalAmount"
          placeholder="0"
          class="total-input"
        />
        <span class="unit-text">원</span>
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
            type="text"
            v-model.number="budgetInputs[catName]"
            class="cat-input"
            placeholder="0"
          />
        </div>
      </div>

      <div class="button-wrapper">
        <button @click="saveBudget" class="complete-btn">설정 완료</button>
      </div>

      <div v-if="currentTotalDisplay > 0" class="status-info">
        현재 카테고리 합계: {{ currentTotalDisplay.toLocaleString() }}원
      </div>
    </div>

    <div v-if="moneyListFiltered.length > 0" class="history-section">
      <h4>{{ month }}월 거래 내역</h4>
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
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useLoginStore } from "@/stores/login";

const loginStore = useLoginStore();

const date = new Date();
const month = ref(date.getMonth() + 1);
const year = ref(date.getFullYear());

const moneyList = ref([]);
const moneyListFiltered = ref([]);
const allCategories = ref([]);
const budgetInputs = ref({});
const savedTotalAmount = ref(0);

// 월 변경 로직
const changeMonth = (delta) => {
  month.value += delta;
  if (month.value < 1) {
    month.value = 12;
    year.value -= 1;
  } else if (month.value > 12) {
    month.value = 1;
    year.value += 1;
  }
};

// 날짜 필터링 함수
const reportDate = (m, y) => {
  const dateStr = `${y}-${m.toString().padStart(2, "0")}`;
  moneyListFiltered.value = moneyList.value.filter(
    (item) => item.date && item.date.startsWith(dateStr),
  );
};

// 실시간 합계 계산
const currentTotalDisplay = computed(() => {
  return Object.values(budgetInputs.value).reduce(
    (acc, cur) => acc + (Number(cur) || 0),
    0,
  );
});

const fetchData = async () => {
  if (!loginStore.user?.id) return;
  try {
    const catResp = await axios.get("http://localhost:3000/outcome-category");
    allCategories.value = catResp.data;

    const userResp = await axios.get(
      `http://localhost:3000/users/${loginStore.user.id}`,
    );
    const userData = userResp.data;

    if (userData.userBudget && userData.userBudget.length > 0) {
      const latestData = userData.userBudget[userData.userBudget.length - 1];
      savedTotalAmount.value = latestData.budgetTot || 0;
      allCategories.value.forEach((catName) => {
        budgetInputs.value[catName] = latestData.budgetCategory?.[catName] || 0;
      });
    }
    reportDate(month.value, year.value);
  } catch (err) {
    console.error("데이터 로드 실패", err);
  }
};

// [수정된 saveBudget 함수]
const saveBudget = () => {
  const tempTotal = currentTotalDisplay.value;

  if (tempTotal > savedTotalAmount.value) {
    alert(`합계(${tempTotal.toLocaleString()}원)가 전체 예산을 초과합니다!`);
    return;
  }

  // 1. 함수 내부에서 날짜 변수를 새로 정의
  const settingDate = `${year.value}-${month.value.toString().padStart(2, "0")}`;

  // 2. 서버 전송용 객체 생성 (.value를 사용하여 실제 값을 추출)
  const budgetSet = {
    budgetYearMonth: settingDate,
    budgetTot: savedTotalAmount.value, // .value 사용
    budgetCategory: { ...budgetInputs.value }, // 객체 복사본 생성
  };

  // alert(`${month.value}월 예산 설정이 완료되었습니다.`);
  console.log("최종 예산 객체:", budgetSet);
};

watch([month, year], () => {
  reportDate(month.value, year.value);
});

onMounted(fetchData);
</script>

<style scoped>
/* 가로로 넓게 확장 */
.budget-management-page {
  max-width: 2000px;
  margin: 0 auto;
  padding: 20px;
}

.month-selector {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin: 20px 0;
  font-size: 22px;
  font-weight: bold;
}

.nav-btn {
  background: none;
  border: none;
  font-size: 28px;

  cursor: pointer;
}

/* 메인 상자 디자인 (가로 확장) */
.options-main-container {
  border-radius: 30px;
  padding: 20px 20px;
}

.total-budget-row {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 10px;
}

.total-input {
  border: none;
  width: 180px;
  font-size: 20px;
  text-align: right;
  outline: none;
  margin: 0 10px;
}

.inner-line {
  margin: 25px 0 40px 0;
}

/* 카테고리 그리드 (좌우 간격을 넓게 조정) */
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px 100px;
}

.category-item {
  display: flex;
  align-items: center;
  justify-content: space-between;
}

.cat-label {
  font-weight: bold;
  font-size: 17px;
}

.cat-input {
  border: none;
  width: 120px;
  text-align: right;
  outline: none;
  font-size: 16px;
}

.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}

.complete-btn {
  background-color: #b39ddb;
  color: white;
  border: none;
  padding: 10px 35px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 17px;
  font-weight: bold;
}

.status-info {
  margin-top: 20px;
  text-align: right;

  font-size: 14px;
}
</style>
