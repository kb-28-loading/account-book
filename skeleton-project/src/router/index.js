import { createRouter, createWebHistory } from "vue-router";

import MoneyListDaily from "@/pages/MoneyCalendar/MoneyListDaily.vue";
import MoneyListLatest from "@/pages/MoneyCalendar/MoneyListLatest.vue";
import MoneyItem from "@/pages/MoneyCalendar/MoneyItem.vue";
import Login from "@/components/Login.vue";
import Home from "@/components/Home.vue";
import Options from "@/components/Options.vue";
import Calender from "@/components/Calender.vue";
import BudgetInOptions from "@/pages/BudgetSetting/BudgetInOptions.vue";
import Budget from "@/pages/BudgetSetting/Budget.vue";
import Report from "@/pages/MoneyReport/Report.vue";
import TransactionLogLatest from "@/pages/OptionsMoneyList/TransactionLogLatest.vue";

const router = createRouter({
  history: createWebHistory(import.meta.env.BASE_URL),
  routes: [
    { path: "/login", component: Login, name: "login" },
    {
      path: "/home",
      component: Home,
      name: "home",
      children: [{ path: "/calender", component: Calender, name: "calender" }],
    },
    {
      path: "/options",
      component: Options,
      name: "options",
      children: [
        {
          path: "/transaction",
          component: TransactionLogLatest,
          name: "options/transaction",
        },
        {
          path: "budget-setting",
          component: BudgetInOptions,
          name: "options/budget-setting",
        },
        {
          path: "budget",
          component: Budget,
          name: "options/budget",
        },

        {
          path: "/moneyreport",
          component: Report,
          name: "options/moneyreport",
        },
      ],
    },
    {
      path: "/",
      component: MoneyListLatest,
      name: "moneyListLatest",
    },
    { path: "/moneyItem/:id", component: MoneyItem, name: "moneyItem" },
    {
      path: "/moneyList/:selectedDate",
      component: MoneyListDaily,
      name: "moneyListDaily",
    },
  ],
});

export default router;
