import { createRouter, createWebHistory } from 'vue-router';

import Home from '@/components/Home.vue';
import Options from '@/components/Options.vue';
import AccountList from '@/pages/BudgetOptions/AccountList.vue';

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: '/', component: Home, name: 'home' },
    { path: '/menu', component: Options, name: 'menu' },
    { path: '/menu/accountList', component: AccountList, name: 'accountList' },
  ],
});

export default router;
