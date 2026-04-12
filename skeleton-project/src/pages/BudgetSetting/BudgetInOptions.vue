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

const allCategories = ref([]);
const budgetInputs = ref({});
const savedTotalAmount = ref(0);
const allBudgets = ref([]);

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

// 현재 선택된 월에 맞는 예산 데이터를 매칭
const updateBudgetDisplay = () => {
  const targetDate = `${year.value}-${month.value.toString().padStart(2, "0")}`;
  const foundBudget = allBudgets.value.find(
    (b) => b.budgetYearMonth === targetDate,
  );

  if (foundBudget) {
    savedTotalAmount.value = foundBudget.budgetTot || 0;
    allCategories.value.forEach((catName) => {
      budgetInputs.value[catName] = foundBudget.budgetCategory?.[catName] || 0;
    });
  } else {
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
    const catResp = await axios.get("http://localhost:3000/outcome-category");
    allCategories.value = catResp.data;

    const userResp = await axios.get(
      `http://localhost:3000/users/${loginStore.user.id}`,
    );
    const userData = userResp.data;

    allBudgets.value = userData.userBudget || [];
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
  const settingDate = `${year.value}-${month.value.toString().padStart(2, "0")}`;
  console.log("저장될 데이터:", {
    budgetYearMonth: settingDate,
    budgetTot: savedTotalAmount.value,
    budgetCategory: { ...budgetInputs.value },
  });
  alert("예산 설정이 완료되었습니다.");
};

// 월 변경 시 예산 데이터만 업데이트
watch([month, year], () => {
  updateBudgetDisplay();
});

onMounted(fetchData);
</script>

<style scoped>
.budget-management-page {
  max-width: 1200px;
  margin: 0 auto;
  padding: 20px;
  color: #333;
}

.title {
  font-weight: bold;
  margin-bottom: 5px;
}
.sub-title {
  font-size: 0.7em;
}

.month-selector {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 50px;
  margin: 30px 0;
  font-size: 24px;
  font-weight: bold;
}

.nav-btn {
  border-radius: 5px;
  padding: 5px 15px;
  cursor: pointer;
}

.options-main-container {
  border-radius: 20px;
  padding: 70px;
}

.total-budget-row {
  font-size: 22px;
  font-weight: bold;
  margin-bottom: 20px;
}
.total-input {
  border: none;
  border-bottom: 2px solid #eee;
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
}
.cat-label {
  font-weight: bold;
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
  background-color: #b39ddb;
  color: white;
  border: none;
  padding: 12px 40px;
  border-radius: 15px;
  cursor: pointer;
  font-size: 18px;
  font-weight: bold;
}
.status-info {
  margin-top: 15px;
  text-align: right;
}
</style>
