import { createRouter, createWebHistory } from 'vue-router';

import MoneyListDaily from '@/pages/MoneyCalendar/MoneyListDaily.vue';
import MoneyListLatest from '@/pages/MoneyCalendar/MoneyListLatest.vue';
import MoneyItem from '@/pages/MoneyCalendar/MoneyItem.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    {
      path: '/',
      component: MoneyListLatest,
      name: 'moneyListLatest',
    },
    { path: '/moneyItem/:id', component: MoneyItem, name: 'moneyItem' },
    {
      path: '/moneyList/:selectedDate',
      component: MoneyListDaily,
      name: 'moneyListDaily',
    },
  ],
});

export default router;
