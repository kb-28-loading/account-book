<template>
  <div class="budget-management-page">
    <header class="header">
      <h1>
        예산관리 <span class="title-sub">예산설정-{{ budgetStore.year }}</span>
      </h1>
      <hr class="title-underline" />
    </header>

    <div class="month-select row">
      <div class="col">
        <i
          class="fa-solid fa-arrow-left left-arrow"
          @click="changeMonth(-1)"
        ></i>
      </div>
      <div class="col selected-month">{{ budgetStore.month }}</div>
      <div class="col">
        <i
          class="fa-solid fa-arrow-right right-arrow"
          @click="changeMonth(1)"
        ></i>
      </div>
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

      <div class="category-grid mt-4">
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
  </div>
</template>

<script setup>
import { ref, onMounted, computed, watch } from "vue";
import axios from "axios";
import { useLoginStore } from "@/stores/login";
import { useBudgetStore } from "@/stores/budget";

const loginStore = useLoginStore();
const budgetStore = useBudgetStore();

const allCategories = ref([]);
const budgetInputs = ref({});
const savedTotalAmount = ref(0);
const allBudgets = ref([]);

/**
 * 월 변경 로직
 */
const changeMonth = (delta) => {
  let newMonth = budgetStore.month + delta;
  let newYear = budgetStore.year;

  if (newMonth < 1) {
    newMonth = 12;
    newYear -= 1;
  } else if (newMonth > 12) {
    newMonth = 1;
    newYear += 1;
  }

  // 스토어 값 업데이트
  budgetStore.month = newMonth;
  budgetStore.year = newYear;
};

/**
 * 현재 선택된 월에 맞는 예산 데이터를 화면에 매칭
 */
const updateBudgetDisplay = () => {
  // 1-9월 앞에 0 붙이기
  const formattedMonth = budgetStore.month.toString().padStart(2, "0");
  const targetDate = `${budgetStore.year}-${formattedMonth}`;

  // 전체 데이터에서 해당 날짜 찾기
  const foundBudget = allBudgets.value.find(
    (b) => b.budgetYearMonth === targetDate,
  );

  if (foundBudget) {
    savedTotalAmount.value = foundBudget.budgetTot || 0;
    // 카테고리별 데이터 매칭
    allCategories.value.forEach((catName) => {
      budgetInputs.value[catName] = foundBudget.budgetCategory?.[catName] || 0;
    });
  } else {
    // 데이터가 없는 월일 경우 초기화
    savedTotalAmount.value = 0;
    allCategories.value.forEach((catName) => {
      budgetInputs.value[catName] = 0;
    });
  }
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
    // 1. 카테고리 목록 로드
    const catResp = await axios.get("http://localhost:3000/outcome-category");
    allCategories.value = catResp.data;

    // 2. 유저 예산 데이터 로드
    const userResp = await axios.get(
      `http://localhost:3000/users/${loginStore.user.id}`,
    );
    allBudgets.value = userResp.data.userBudget || [];

    // 3. 현재 설정된 월 데이터 즉시 표시
    updateBudgetDisplay();
  } catch (err) {
    console.error("데이터 로드 실패", err);
  }
};

const saveBudget = () => {
  const tempTotal = currentTotalDisplay.value;
  if (tempTotal > savedTotalAmount.value) {
    alert(`합계(${tempTotal.toLocaleString()}원)가 전체 예산을 초과합니다!`);
    return;
  }

  const settingDate = `${budgetStore.year}-${budgetStore.month.toString().padStart(2, "0")}`;
  const budgetPayload = {
    budgetYearMonth: settingDate,
    budgetTot: savedTotalAmount.value,
    budgetCategory: { ...budgetInputs.value },
  };

  console.log("서버로 저장될 데이터:", budgetPayload);
  alert("예산 설정이 완료되었습니다.");
};

/**
 * [핵심 수정] 스토어의 특정 속성을 감시할 때는 Getter 함수 () => 사용
 */
watch([() => budgetStore.month, () => budgetStore.year], () => {
  updateBudgetDisplay();
});

onMounted(fetchData);
</script>

<style scoped>
/* 기존 스타일 유지 */
.budget-management-page {
  max-width: 1200px;
  color: #333;
}
.title {
  font-weight: bold;
  margin-bottom: 5px;
}
.title-sub {
  font-size: 16px;
  color: #bfa5d4;
}
.month-select {
  display: flex;
  align-items: center;
  margin-bottom: 5px;
}
.left-arrow {
  font-size: 28px;
  cursor: pointer;
}
.selected-month {
  font-size: 35px;
  text-align: center;
  cursor: default;
  width: 60px;
}
.right-arrow {
  font-size: 28px;
  cursor: pointer;
  display: flex;
  justify-content: flex-end;
}
.total-budget-row {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}
.total-input {
  border: none;
  border-bottom: 2px solid #f8f4fe;
  width: 200px;
  text-align: center;
  outline: none;
  font-size: 20px;
}
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 30px 100px;
}
.category-item {
  display: flex;
  justify-content: space-between;
  align-items: center;
  border-bottom: #bfa5d4 1px solid;
}
.cat-label {
  font-weight: bold;
  cursor: default;
}
.cat-input {
  border: none;
  width: 120px;
  text-align: right;
  outline: none;
}
.button-wrapper {
  display: flex;
  justify-content: flex-end;
  margin-top: 40px;
}
.complete-btn {
  background-color: #bfa5d4;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}
.complete-btn:hover {
  background-color: #a98bc4;
}
.status-info {
  margin-top: 15px;
  text-align: right;
}
</style>
