import { createRouter, createWebHistory } from 'vue-router';

import MoneyListDaily from '@/pages/MoneyCalendar/MoneyListDaily.vue';
import MoneyListLatest from '@/pages/MoneyCalendar/MoneyListLatest.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/moneyListLatest',
      component: MoneyListLatest,
      name: 'moneyListLatest',
    },
    {
      path: '/moneyList/:selectedDate',
      component: MoneyListDaily,
      name: 'moneyListDaily',
    },
  ],
});

export default router;
