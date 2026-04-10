<template>
  <div>
    <div>
      <div>예산관리 <span>예산설정</span></div>

      <div>
        <div></div>
        <span @click="prevMonth">←</span>
        <span>{{ month }}월</span>
        <span @click="nextMonth">→</span>
        <div>전체예산 :</div>

        <div></div>
        <div>전체예산:</div>

        <div>
          식비 : <input type="number" v-model="budget.food" /><br /><br />
          주거/통신 :
          <input type="number" v-model="budget.housing" /><br /><br />
          생활 : <input type="number" v-model="budget.life" /><br /><br />
          온라인쇼핑 :
          <input type="number" v-model="budget.shopping" /><br /><br />
          카페/간식 :
          <input type="number" v-model="budget.cafe" /><br /><br />
          교통 : <input type="number" v-model="budget.transport" />
        </div>

        <div>문화/여가 : <input v-model="budget.culture" /></div>
      </div>
    </div>

    <div>
      <button @click="setting">설정완료</button>
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

// 사용자 + 월 바뀔 때마다 자동 반영
watch(
  [month, selectedUser],
  () => {
    const userData = userBudgetData[selectedUser.value];
    const monthData = userData?.[month.value];

    budget.value = {
      ...defaultBudget,
      ...monthData,
    };
  },
  { immediate: true },
);

// 월 이동
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
