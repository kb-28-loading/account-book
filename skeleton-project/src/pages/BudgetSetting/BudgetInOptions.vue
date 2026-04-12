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
        <i class="fa-solid fa-arrow-left left-arrow" @click="changeMonth(-1)"></i>
      </div>
      <div class="col selected-month">{{ budgetStore.month }}</div>
      <div class="col">
        <i class="fa-solid fa-arrow-right right-arrow" @click="changeMonth(1)"></i>
      </div>
    </div>

    <div class="options-main-container">
      <div class="total-budget-row">
        <label class="label-text">전체예산 : </label>
        <input type="text" v-model.number="savedTotalAmount" placeholder="0" class="total-input" />
        <span class="unit-text">원</span>
      </div>

      <hr class="inner-line" />

      <div class="category-grid mt-4">
        <div v-for="catName in allCategories" :key="catName" class="category-item">
          <div class="cat-label">{{ catName }} :</div>
          <input type="text" v-model.number="budgetInputs[catName]" class="cat-input" placeholder="0" />
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
// ===========================================================
// ===========================================================
// ===========================================================
const saveBudget = async () => {
  // 합계 초과 검사 
  const tempTotal = currentTotalDisplay.value;
  if (tempTotal > savedTotalAmount.value) {
    alert(`합계(${tempTotal.toLocaleString()}원)가 전체 예산을 초과합니다!`);
    return;
  }

  // 저장할 데이터(Payload) 포장
  const settingDate = `${budgetStore.year}-${budgetStore.month.toString().padStart(2, "0")}`;

  // 핵심 수정: 값이 0인 카테고리는 빼고 담을 새로운 바구니 만들기
  const filteredCategory = {};
  for (const [key, value] of Object.entries(budgetInputs.value)) {
    if (value > 0) { // 0보다 큰 값(입력된 값)만 바구니에 담습니다.
      filteredCategory[key] = value;
    }
  }

  try {
    let updatedBudgets = [...allBudgets.value];

    const existingIndex = updatedBudgets.findIndex(
      (b) => b.budgetYearMonth === settingDate
    );

    if (existingIndex !== -1) {
      // 👇 2. 핵심 수정: 이미 있는 데이터면 기존 속성(id 등)을 그대로 가져오고(...) 덮어쓰기
      updatedBudgets[existingIndex] = {
        ...updatedBudgets[existingIndex], // 기존 id나 다른 데이터를 잃어버리지 않게 복사!
        budgetTot: savedTotalAmount.value,
        budgetCategory: filteredCategory,   // 0원짜리가 제거된 깔끔한 카테고리만 저장
      };
    } else {
      // 데이터가 없어서 새로 만들 때
      updatedBudgets.push({
        id: Date.now(), // 혹시 몰라 새 데이터에는 고유 id를 하나 달아줍니다
        budgetYearMonth: settingDate,
        budgetTot: savedTotalAmount.value,
        budgetCategory: filteredCategory,
      });
    }

    // 서버로 전송
    await axios.patch(`http://localhost:3000/users/${loginStore.user.id}`, {
      userBudget: updatedBudgets,
    });

    // 로컬 데이터 최신화
    allBudgets.value = updatedBudgets;

    console.log("서버 저장 완료:", updatedBudgets);
    alert("예산 설정이 성공적으로 저장되었습니다!");

  } catch (error) {
    console.error("예산 저장 실패:", error);
    alert("저장 중 서버 오류가 발생했습니다.");
  }
};
// ===========================================================
// ===========================================================
// ===========================================================

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
