<template>
  <div class="budget-wrap">
    <!-- 헤더 -->
    <div class="header">
      <h1 class="mb-0">예산관리</h1>
      <span class="title-sub">예산확인-{{ budgetStore.year }}</span>
    </div>
    <hr class="title-underline" />

    <!-- 월 이동 -->
    <!-- <div class="month-nav">
      <span class="nav-btn" @click="prevMonth"
        ><i class="fa-solid fa-arrow-left left-arrow"></i
      ></span>
      <span class="selected-month">{{ displayYearMonth }}</span>
      <span class="nav-btn" @click="nextMonth"
        ><i class="fa-solid fa-arrow-right right-arrow"></i
      ></span>
    </div> -->

    <div class="month-select row">
      <div class="col">
        <i
          class="fa-solid fa-arrow-left left-arrow"
          @click.stop="prevMonth"
        ></i>
      </div>
      <div class="col selected-month">{{ budgetStore.month }}</div>
      <div class="col">
        <i
          class="fa-solid fa-arrow-right right-arrow"
          @click.stop="nextMonth"
        ></i>
      </div>
    </div>

    <!-- 예산 데이터가 있는 경우 -->
    <div v-if="monthBudget" class="card">
      <!-- 전체 예산 요약 -->
      <div class="summary">
        <span
          >전체예산 :
          <strong>{{ monthBudget.budgetTot.toLocaleString() }} 원</strong></span
        >
        <span
          >지출 : <strong>{{ totalSpent.toLocaleString() }} 원</strong></span
        >
        <span
          >남은예산 : <strong>{{ remaining.toLocaleString() }} 원</strong></span
        >
      </div>

      <!-- 전체 예산 대비 지출 progress bar -->
      <div class="bar-track total-track">
        <div
          class="bar-fill"
          :class="{ over: totalPercent > 100 }"
          :style="{ width: clamp(100 - totalPercent) + '%' }"
        ></div>
      </div>

      <!-- 카테고리별 progress bar 2열 그리드 -->
      <div class="category-grid">
        <div
          v-for="(budgetAmount, category) in monthBudget.budgetCategory"
          :key="category"
          class="category-item"
        >
          <span class="category-label">{{ category }}</span>
          <div class="bar-track">
            <div
              class="bar-fill"
              :class="{ over: categoryPercent(category, budgetAmount) > 100 }"
              :style="{
                width:
                  clamp(100 - categoryPercent(category, budgetAmount)) + '%',
              }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <!-- 예산 데이터가 없는 경우 -->
    <div v-else class="no-budget">
      <p class="cursor-default">
        {{ displayYearMonth }}월에 설정된 예산이 없습니다.
      </p>
    </div>

    <!-- 예산수정 버튼 -->
    <div class="btn-wrap">
      <button class="edit-btn" @click="goToBudgetSetting">예산수정</button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted } from 'vue';
import { useRouter } from 'vue-router';
import axios from 'axios';
import { useLoginStore } from '@/stores/login';
import { useBudgetStore } from '@/stores/budget';

const router = useRouter();
const loginStore = useLoginStore();
const budgetStore = useBudgetStore();

const userBudget = ref([]);
const moneyList = ref([]);

const currentYearMonth = computed(() => {
  const mm = String(budgetStore.month).padStart(2, '0');
  return `${budgetStore.year}-${mm}`;
});

const displayYearMonth = computed(() => `${budgetStore.month}`);

const monthBudget = computed(
  () =>
    userBudget.value.find(
      (b) => b.budgetYearMonth === currentYearMonth.value,
    ) || null,
);

const monthExpenses = computed(() =>
  moneyList.value.filter(
    (item) =>
      item.type === '지출' && item.date.startsWith(currentYearMonth.value),
  ),
);

const spentByCategory = computed(() => {
  const result = {};
  for (const item of monthExpenses.value) {
    result[item.category] = (result[item.category] || 0) + item.userMoney;
  }
  return result;
});

const totalSpent = computed(() =>
  monthExpenses.value.reduce((sum, item) => sum + item.userMoney, 0),
);

const remaining = computed(() => {
  if (!monthBudget.value) return 0;
  return monthBudget.value.budgetTot - totalSpent.value;
});

const totalPercent = computed(() => {
  if (!monthBudget.value || monthBudget.value.budgetTot === 0) return 0;
  return (totalSpent.value / monthBudget.value.budgetTot) * 100;
});

const categoryPercent = (category, budget) => {
  if (!budget) return 0;
  return ((spentByCategory.value[category] || 0) / budget) * 100;
};

const clamp = (value) => Math.min(Math.max(value, 0), 100);

const prevMonth = () => {
  if (budgetStore.month === 1) {
    budgetStore.month = 12;
    budgetStore.year--;
  } else {
    budgetStore.month--;
  }
};

const nextMonth = () => {
  if (budgetStore.month === 12) {
    budgetStore.month = 1;
    budgetStore.year++;
  } else {
    budgetStore.month++;
  }
};

const goToBudgetSetting = () => {
  router.push({ name: 'options/budget-setting' });
};

const loadData = async () => {
  if (!loginStore.user?.id) return;
  try {
    const res = await axios.get(`/api/users/${loginStore.user.id}`);
    userBudget.value = res.data.userBudget || [];
    moneyList.value = res.data.moneyList || [];
  } catch (err) {
    console.error('예산 데이터 로드 실패', err);
  }
};

onMounted(loadData);
</script>

<style scoped>
.budget-wrap {
  min-height: 523px;
}
/* 헤더 */
.header {
  display: flex;
  align-items: baseline;
  gap: 10px;
  margin-bottom: 8px;
}

.title-main {
  font-size: 22px;
  font-weight: bold;
  color: #333;
}

.title-sub {
  font-size: 16px;
  color: #bfa5d4;
}

.divider {
  border: none;
  border-top: 1px solid #ccc;
  margin-bottom: 16px;
}

/* 월 네비게이션 */
.month-nav {
  display: flex;
  align-items: center;
  justify-content: center;
  gap: 24px;
  margin-bottom: 16px;
}

.nav-btn {
  cursor: pointer;
  /* font-size: 18px; */
  color: #bfa5d4;
  user-select: none;
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
}
.right-arrow {
  font-size: 28px;
  cursor: pointer;
  display: flex;
  justify-content: end;
}

/* 카드 */
.card {
  border: 1.5px solid #a98bc4;
  border-radius: 16px;
  padding: 20px;
  background: #fff;
}

/* 요약 텍스트 */
.summary {
  display: flex;
  gap: 20px;
  color: #a98bc4;
  font-size: 14px;
  margin-bottom: 12px;
  flex-wrap: wrap;
}

.summary strong {
  font-weight: 600;
}

/* progress bar */
.bar-track {
  background: #e0e0e0;
  border-radius: 999px;
  overflow: hidden;
  height: 10px;
}

.total-track {
  height: 14px;
  margin-bottom: 20px;
}

.bar-fill {
  height: 100%;
  background: #bfa5d4;
  border-radius: 999px;
  transition: width 0.4s ease;
}

.bar-fill.over {
  background: #e53935;
}

/* 카테고리 2열 그리드 */
.category-grid {
  display: grid;
  grid-template-columns: 1fr 1fr;
  gap: 12px 24px;
}

.category-item {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.category-label {
  font-size: 13px;
  color: #555;
}

/* 예산 없음 */
.no-budget {
  text-align: center;
  color: #999;
  padding: 40px 0;
}

/* 버튼 */
.btn-wrap {
  display: flex;
  justify-content: flex-end;
  margin-top: 16px;
}

.edit-btn {
  background: #bfa5d4;
  color: #fff;
  border: none;
  border-radius: 20px;
  padding: 8px 20px;
  font-size: 14px;
  cursor: pointer;
}

.edit-btn:hover {
  background: #a98bc4;
}
</style>

<!--
=== Budget.vue 변수 정리 ===

[ ref - 상태값 ]
  today            : 컴포넌트 초기화 시점의 Date 객체. year/month 초기값 세팅에만 사용
  year             : 현재 선택된 연도 (숫자, 예: 2026)
  month            : 현재 선택된 월 (숫자 1~12)
  userBudget       : API에서 받아온 유저의 전체 월별 예산 배열 (db.json의 userBudget)
  moneyList        : API에서 받아온 유저의 전체 거래 내역 배열 (db.json의 moneyList)

[ computed - 계산값 ]
  currentYearMonth : year/month를 "YYYY-MM" 형식 문자열로 변환. API 데이터 필터링 키로 사용
  displayYearMonth : 화면에 표시할 월 문자열 (예: "4월")
  monthBudget      : userBudget 중 currentYearMonth와 일치하는 달의 예산 객체. 없으면 null
  monthExpenses    : moneyList 중 이번 달 + type이 "지출"인 거래만 필터링한 배열
  spentByCategory  : monthExpenses를 카테고리별로 합산한 객체 (예: { 식비: 13700, 교통: 31500 })
  totalSpent       : 이번 달 전체 지출 합계 (숫자)
  remaining        : 전체예산(budgetTot) - totalSpent. 남은 예산
  totalPercent     : totalSpent / budgetTot * 100. 전체 예산 대비 지출 퍼센트

[ 일반 함수 ]
  categoryPercent  : (category, budget) → 해당 카테고리의 지출 / 예산 * 100. 카테고리별 퍼센트 계산
  clamp            : (value) → 0~100 사이로 값을 제한. 바 너비가 범위를 벗어나지 않도록 보정
  prevMonth        : 월을 1 감소. 1월이면 전년도 12월로 이동
  nextMonth        : 월을 1 증가. 12월이면 다음 연도 1월로 이동
  goToBudgetSetting: 예산설정 페이지(BudgetInOptions)로 라우터 이동
  loadData         : API(/api/users/:id)에서 userBudget과 moneyList를 가져와 ref에 저장
-->
