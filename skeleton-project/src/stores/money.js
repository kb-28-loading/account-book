// src/stores/money.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/login'; // 로그인 정보 가져오기

export const useMoneyStore = defineStore('money', () => {
  const userMoneyList = ref([]);
  const reloading = ref(0);

  // 데이터 가져오는 함수
  const loadData = async () => {
    const loginStore = useLoginStore();
    if (loginStore.user?.id) {
      try {
        const res = await axios.get(`/api/users/${loginStore.user.id}`);
        userMoneyList.value = res.data.moneyList;
        console.log('창고에서 가계부 최신화 성공!');
        reloading.value++;
        console.log('다시 로딩', reloading.value);
      } catch (err) {
        console.log('데이터 로드 실패', err);
      }
    }
  };

  return { userMoneyList, loadData, reloading };
});
