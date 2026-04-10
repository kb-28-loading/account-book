<template>
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
</template>

<script setup>
import { ref } from 'vue';

const month = ref(4);

const budget = ref({
  food: 0,
  housing: 0,
  life: 0,
  shopping: 0,
  cafe: 0,
  transport: 0,
  culture: 0,
});

const prevMonth = () => {
  if (month.value > 1) month.value--;
};

const nextMonth = () => {
  if (month.value < 12) month.value++;
};

const setting = () => {
  console.log(budget.value);
};
</script>
