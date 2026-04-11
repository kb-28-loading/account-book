<template>
  <div style="padding: 24px">
    <div class="budget-box">
      <div class="title">예산관리 <span class="sub">예산확인</span></div>

      <div class="month-box">
        <span class="arrow" @click="prevMonth">←</span>
        <span class="month-text">{{ month }}월</span>
        <span class="arrow" @click="nextMonth">→</span>
      </div>

      <br />

      <div>
        전체예산 : {{ totalBudget.toLocaleString() }}원 &nbsp;&nbsp; 지출 :
        {{ totalSpend.toLocaleString() }}원 &nbsp;&nbsp; 남은예산 :
        {{ remainBudget.toLocaleString() }}원
      </div>

      <br />

      <div
        class="progress"
        role="progressbar"
        :aria-valuenow="totalProgress"
        aria-valuemin="0"
        aria-valuemax="100"
        style="height: 28px; border-radius: 16px"
      >
        <div
          class="progress-bar"
          :style="{
            width: totalProgress + '%',
            backgroundColor: '#c4addd',
            transition: 'width 0.5s ease',
            borderRadius: '16px',
          }"
        ></div>
      </div>

      <br />

      <div v-for="item in categories" :key="item.key">
        <div>
          {{ item.label }} : {{ spendData[item.key]?.toLocaleString() || 0 }} /
          {{ budgetData[item.key]?.toLocaleString() || 0 }}원
        </div>

        <div
          class="progress"
          role="progressbar"
          :aria-valuenow="getCategoryProgress(item.key)"
          aria-valuemin="0"
          aria-valuemax="100"
          style="height: 18px; border-radius: 12px"
        >
          <div
            class="progress-bar"
            :style="{
              width: getCategoryProgress(item.key) + '%',
              backgroundColor: '#c4addd',
              transition: 'width 0.5s ease',
              borderRadius: '12px',
            }"
          ></div>
        </div>

        <br />
      </div>
    </div>

    <div
      style="
        margin-top: 48px;
        width: 900px;
        display: flex;
        justify-content: flex-end;
      "
    >
      <button
        @click="setting"
        style="
          padding: 10px 18px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
        "
      >
        설정완료
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, watch } from "vue";

const month = ref(1);
const selectedUser = ref(localStorage.getItem("loginUserName") || "신송윤");

const userData = {
  신송윤: {
    1: {
      totalBudget: 700000,
      budgetData: {
        food: 250000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 0,
        transport: 100000,
        culture: 150000,
      },
      spendData: {
        food: 90000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 0,
        transport: 30000,
        culture: 40000,
      },
    },
    2: {
      totalBudget: 750000,
      budgetData: {
        food: 300000,
        housing: 0,
        life: 0,
        shopping: 200000,
        cafe: 0,
        transport: 0,
        culture: 0,
      },
      spendData: {
        food: 120000,
        housing: 0,
        life: 0,
        shopping: 50000,
        cafe: 0,
        transport: 0,
        culture: 0,
      },
    },
    3: {
      totalBudget: 800000,
      budgetData: {
        food: 250000,
        housing: 0,
        life: 0,
        shopping: 150000,
        cafe: 0,
        transport: 0,
        culture: 200000,
      },
      spendData: {
        food: 100000,
        housing: 0,
        life: 0,
        shopping: 67000,
        cafe: 0,
        transport: 0,
        culture: 14000,
      },
    },
  },

  한혜지: {
    1: {
      totalBudget: 900000,
      budgetData: {
        food: 300000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 0,
        transport: 100000,
        culture: 200000,
      },
      spendData: {
        food: 8200,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 5500,
        transport: 1500,
        culture: 50000,
      },
    },
    2: {
      totalBudget: 950000,
      budgetData: {
        food: 350000,
        housing: 0,
        life: 0,
        shopping: 200000,
        cafe: 0,
        transport: 100000,
        culture: 0,
      },
      spendData: {
        food: 100000,
        housing: 0,
        life: 0,
        shopping: 30000,
        cafe: 0,
        transport: 20000,
        culture: 0,
      },
    },
    3: {
      totalBudget: 1000000,
      budgetData: {
        food: 300000,
        housing: 0,
        life: 0,
        shopping: 200000,
        cafe: 0,
        transport: 0,
        culture: 300000,
      },
      spendData: {
        food: 150000,
        housing: 0,
        life: 0,
        shopping: 70000,
        cafe: 0,
        transport: 0,
        culture: 80000,
      },
    },
  },

  장진서: {
    1: {
      totalBudget: 600000,
      budgetData: {
        food: 200000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 0,
        transport: 0,
        culture: 150000,
      },
      spendData: {
        food: 30000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 10000,
        transport: 0,
        culture: 22000,
      },
    },
    2: {
      totalBudget: 650000,
      budgetData: {
        food: 250000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 0,
        transport: 100000,
        culture: 0,
      },
      spendData: {
        food: 40000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 4500,
        transport: 1350,
        culture: 0,
      },
    },
    3: {
      totalBudget: 700000,
      budgetData: {
        food: 200000,
        housing: 0,
        life: 0,
        shopping: 100000,
        cafe: 0,
        transport: 0,
        culture: 200000,
      },
      spendData: {
        food: 50000,
        housing: 0,
        life: 0,
        shopping: 0,
        cafe: 0,
        transport: 0,
        culture: 22000,
      },
    },
  },
};

const defaultBudgetData = {
  food: 0,
  housing: 0,
  life: 0,
  shopping: 0,
  cafe: 0,
  transport: 0,
  culture: 0,
};

const defaultSpendData = {
  food: 0,
  housing: 0,
  life: 0,
  shopping: 0,
  cafe: 0,
  transport: 0,
  culture: 0,
};

const totalBudget = ref(0);
const budgetData = ref({ ...defaultBudgetData });
const spendData = ref({ ...defaultSpendData });

const categories = [
  { key: "food", label: "식비" },
  { key: "housing", label: "주거/통신" },
  { key: "life", label: "생활" },
  { key: "shopping", label: "온라인쇼핑" },
  { key: "cafe", label: "카페/간식" },
  { key: "transport", label: "교통" },
  { key: "culture", label: "문화/여가" },
];

watch(
  [selectedUser, month],
  () => {
    const currentMonthData = userData[selectedUser.value]?.[month.value];

    totalBudget.value = currentMonthData?.totalBudget || 0;
    budgetData.value = {
      ...defaultBudgetData,
      ...(currentMonthData?.budgetData || {}),
    };
    spendData.value = {
      ...defaultSpendData,
      ...(currentMonthData?.spendData || {}),
    };
  },
  { immediate: true },
);

const totalSpend = computed(() => {
  return Object.values(spendData.value).reduce((sum, value) => sum + value, 0);
});

const remainBudget = computed(() => {
  return totalBudget.value - totalSpend.value;
});

const totalProgress = computed(() => {
  if (totalBudget.value === 0) return 0;
  return Math.min((totalSpend.value / totalBudget.value) * 100, 100);
});

const getCategoryProgress = (key) => {
  const budget = budgetData.value[key] || 0;
  const spend = spendData.value[key] || 0;

  if (budget === 0) return 0;
  return Math.min((spend / budget) * 100, 100);
};

const prevMonth = () => {
  if (month.value > 1) month.value--;
};

const nextMonth = () => {
  if (month.value < 12) month.value++;
};

const setting = () => {
  console.log("현재 사용자:", selectedUser.value);
  console.log("현재 월:", month.value);
  console.log("예산 데이터:", budgetData.value);
  console.log("지출 데이터:", spendData.value);
};
</script>
