import { defineStore } from 'pinia';
import { ref } from 'vue';

export const useBudgetStore = defineStore('budget', () => {
  const today = new Date();
  const month = ref(today.getMonth() + 1);
  const year = ref(today.getFullYear());

  return { month, year };
});
