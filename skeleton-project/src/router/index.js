import { createRouter, createWebHistory } from "vue-router";

import MoneyListDaily from "@/pages/MoneyCalendar/MoneyListDaily.vue";
import MoneyListLatest from "@/pages/MoneyCalendar/MoneyListLatest.vue";
import MoneyItem from "@/pages/MoneyCalendar/MoneyItem.vue";
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";
import Options from "@/components/Options.vue";
import Calender from "@/components/Calender.vue";
import BudgetInOptions from "@/pages/BudgetSetting/BudgetInOptions.vue";
import Report from "@/pages/MoneyReport/Report.vue";
import TransactionLogLatest from "@/pages/OptionsMoneyList/TransactionLogLatest.vue";
import TransactionLogList from "@/pages/OptionsMoneyList/TransactionLogList.vue";
import Budget from "@/pages/BudgetSetting/Budget.vue";
import Join from "@/components/Join.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: Login, name: "login" },
    { path: "/join", component: Join, name: "join" },
    {
      path: "/home",
      component: Home,
      name: "home",
      children: [
        { path: 'calender', component: Calender, name: 'calender' },
        {
          path: ':selectedDate',
          component: MoneyListDaily,
          name: "moneyListDaily",
        },
        {
          path: "",
          component: MoneyListLatest,
          name: "moneyListLatest",
        },
      ],
    },
    {
      path: "/options",
      component: Options,
      name: "options",
      children: [
        {
          path: "transaction",
          component: TransactionLogLatest,
          name: "options/transaction",
          children: [
            {
              path: "transaction/list",
              component: TransactionLogList,
              name: "loglist",
            },
          ],
        },
        {
          path: "budget-setting",
          component: BudgetInOptions,
          name: 'options/budget-setting',
        },
        { path: "budget", component: Budget, name: "options/budget" },
        {
          path: "moneyreport",
          component: Report,
          name: "options/moneyreport",
        },
      ],
    },

    { path: "/moneyItem/:id", component: MoneyItem, name: "moneyItem" },
  ],
});

export default router;
