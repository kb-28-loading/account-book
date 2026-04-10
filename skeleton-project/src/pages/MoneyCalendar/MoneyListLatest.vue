<script setup>
import AddTransactionModal from '@/components/AddTransactionModal.vue'; // 자식 가져오기

import { ref, onMounted, watch, onBeforeUpdate } from 'vue';
import { useLoginStore } from '@/stores/login';

import axios from 'axios';

const loginStore = useLoginStore();
const LatestList = ref([]);

const getMoneyList = async () => {
  const res = await axios.get(`/api/users/${loginStore.user.id}`);
  LatestList.value = res.data.moneyList;
  console.log('데이터 로드 성공:', LatestList.value);
};

watch(
  () => loginStore.user?.id, // 1. 유저 ID라는 데이터의 변화를 지켜본다
  (newId) => {
    // 2. 변화가 감지되면 (undefined -> 실제 ID)
    if (newId) {
      getMoneyList(); // 3. 그때 데이터를 가져온다!
      console.log('데이터 가져왔슈');
    }
  },
);

onMounted(() => {
  // console.log('마운트 시작!');
  getMoneyList();
  // console.log('데이터 함수 작동!');
});

// =========================================================================
// 정렬 버튼
const isSorted = ref(true);

const clickedPlus = () => {
  if (!isSorted.value) {
    LatestList.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('최신순정렬');

    isSorted.value = true;
  } else {
    LatestList.value.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('과거순 정렬');
    isSorted.value = false;
  }
};
// ==========================================================
// 팝업창 열고 닫기 부분
const isModalOpen = ref(false); /* 팝업창의 열림/닫힘 상태를 저장할 변수 */
const AddList = () => {
  isModalOpen.value = true;
};

const isModaClose = () => {
  isModalOpen.value = false;
};
// ==========================================================
</script>

<template>
  <div>
    <button @click="clickedPlus">
      {{ isSorted ? '과거순정렬' : '최신순정렬' }}
    </button>
    <table class="table">
      <thead>
        <tr>
          <th>거래명</th>
          <th>카테고리</th>
          <th>금액</th>
          <th>날짜</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in LatestList" :key="value.listId">
          <td>{{ value.title }}</td>
          <td>{{ value.category }}</td>
          <td>{{ value.userMoney }}</td>
          <td>{{ value.date }}</td>
        </tr>
      </tbody>
    </table>
    <!-- 목록 추가 버튼 -->
    <button @click="AddList">+</button>
    <AddTransactionModal
      v-if="isModalOpen === true"
      @post="getMoneyList"
      @close="isModaClose"
    />
  </div>
</template>
