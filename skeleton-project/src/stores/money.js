// src/stores/money.js
import { defineStore } from 'pinia';
import { ref } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/login'; // 로그인 정보 가져오기

export const useMoneyStore = defineStore('money', () => {
    const userMoneyList = ref([]);

    // 데이터 가져오는 함수를 아예 창고 안에 만들어버립니다!
    const loadData = async () => {
        const loginStore = useLoginStore();
        if (loginStore.user?.id) {
            try {
                const res = await axios.get(`/api/users/${loginStore.user.id}`);
                userMoneyList.value = res.data.moneyList;
                console.log('창고에서 가계부 최신화 성공!');
            } catch (err) {
                console.log("데이터 로드 실패", err);
            }
        }
    };

    return { userMoneyList, loadData };
});