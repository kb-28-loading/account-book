<script setup>
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
    } else {
      setTimeout(() => {}, 1000);
    }
  },
);

onMounted(() => {
  console.log('마운트 시작!');
  getMoneyList();
  console.log('데이터 함수 작동!');
});
</script>

<template>
  <div>
    <table class="table">
      <p>{{ console.log('테이블 시작') }}</p>
      <thead>
        <tr>
          <th>거래명</th>
          <th>카테고리</th>
          <th>금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in LatestList" :key="value.listId">
          <td>{{ value.title }}</td>
          <td>{{ value.category }}</td>
          <td>{{ value.date }}</td>
        </tr>
      </tbody>
    </table>
    <p>{{ console.log('테이블 끗') }}</p>
  </div>
</template>
