import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useLoginStore = defineStore('login', () => {
  // states
  const user = ref({
    userID: 'hj4094',
    userPW: 'gPwl09092001',
    userName: '한혜지',
    account: [{ bank: 'KB', info: '48550201280534', balance: 100000 }],
    moneyList: [
      {
        title: '티켓팅',
        date: '2026-04-07',
        userMoney: 50000,
        type: 'pay',
        category: 'culture',
        listId: 834291,
      },
      {
        title: '카페',
        date: '2026-04-06',
        userMoney: 5500,
        type: 'pay',
        category: 'food',
        listId: 192847,
        memo: '아이스 아메리카노',
      },
      {
        title: '편의점',
        date: '2026-04-05',
        userMoney: 8200,
        type: 'pay',
        category: 'food',
        listId: 563920,
      },
      {
        title: '버스',
        date: '2026-04-05',
        userMoney: 1500,
        type: 'pay',
        category: 'transport',
        listId: 774512,
      },
      {
        title: '알바비',
        date: '2026-04-03',
        userMoney: 120000,
        type: 'income',
        category: 'salary',
        listId: 309485,
        memo: '주말 근무',
      },
    ],
    id: 1,
  });
  return { user };
});
