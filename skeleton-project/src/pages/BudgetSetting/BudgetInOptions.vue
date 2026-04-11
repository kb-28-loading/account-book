<template>
  <div style="padding: 24px">
    <div>
      <div style="font-size: 28px; font-weight: 700; margin-bottom: 20px">
        예산관리 <span>예산설정</span>
      </div>

      <div>
        <div style="font-size: 24px; font-weight: 600; margin-bottom: 16px">
          <span @click="prevMonth" style="cursor: pointer">←</span>
          <span style="margin: 0 12px">{{ month }}월</span>
          <span @click="nextMonth" style="cursor: pointer">→</span>
        </div>

        <div style="font-size: 22px; font-weight: 700; margin-bottom: 24px">
          전체예산 : {{ totalBudget.toLocaleString() }}
        </div>

        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 48px;
            row-gap: 20px;
            max-width: 900px;
          "
        >
          <div
            v-for="item in categories"
            :key="item.key"
            style="display: flex; align-items: center; gap: 12px"
          >
            <div
              style="
                width: 120px;
                text-align: right;
                font-size: 18px;
                font-weight: 600;
                flex-shrink: 0;
              "
            >
              {{ item.label }} :
            </div>

            <input
              type="number"
              v-model.number="budget[item.key]"
              style="
                width: 220px;
                height: 40px;
                padding: 0 12px;
                font-size: 18px;
                box-sizing: border-box;
              "
            />
          </div>
        </div>
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
import { ref, watch } from "vue";

const month = ref(1);
const selectedUser = ref("신송윤");

const userBudgetData = {
  신송윤: {
    1: { food: 250000, culture: 150000, transport: 100000 },
    2: { food: 300000, shopping: 200000 },
    3: { food: 250000, culture: 200000, shopping: 150000 },
  },
  한혜지: {
    1: { food: 300000, transport: 100000, culture: 200000 },
    2: { food: 350000, shopping: 200000, transport: 100000 },
    3: { food: 300000, shopping: 200000, culture: 300000 },
  },
  장진서: {
    1: { food: 200000, culture: 150000 },
    2: { food: 250000, transport: 100000 },
    3: { food: 200000, shopping: 100000, culture: 200000 },
  },
};

const categories = [
  { key: "food", label: "식비" },
  { key: "housing", label: "주거/통신" },
  { key: "life", label: "생활" },
  { key: "shopping", label: "온라인쇼핑" },
  { key: "cafe", label: "카페/간식" },
  { key: "transport", label: "교통" },
  { key: "culture", label: "문화/여가" },
];

const defaultBudget = {
  food: 0,
  housing: 0,
  life: 0,
  shopping: 0,
  cafe: 0,
  transport: 0,
  culture: 0,
};

const budget = ref({ ...defaultBudget });
const totalBudget = ref(0);

const calculateTotal = () => {
  totalBudget.value =
    (budget.value.food || 0) +
    (budget.value.housing || 0) +
    (budget.value.life || 0) +
    (budget.value.shopping || 0) +
    (budget.value.cafe || 0) +
    (budget.value.transport || 0) +
    (budget.value.culture || 0);
};

watch(
  [month, selectedUser],
  () => {
    const userData = userBudgetData[selectedUser.value];
    const monthData = userData?.[month.value];

    budget.value = {
      ...defaultBudget,
      ...monthData,
    };

    calculateTotal();
  },
  { immediate: true },
);

watch(
  budget,
  () => {
    calculateTotal();
  },
  { deep: true },
);

const prevMonth = () => {
  if (month.value > 1) month.value--;
};

const nextMonth = () => {
  if (month.value < 12) month.value++;
};

const setting = () => {
  console.log("현재 유저:", selectedUser.value);
  console.log("현재 월:", month.value);
  console.log("예산:", budget.value);
};
</script>
