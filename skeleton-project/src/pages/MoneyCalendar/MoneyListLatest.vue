<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>거래명</th>
          <th>카테고리</th>
          <th>금액</th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in moneyList" :key="value.listId">
          <td>{{ value.title }}</td>
          <td>{{ value.category }}</td>
          <td>{{ value.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/login';
import axios from 'axios';

const loginStore = useLoginStore();
const LatestList = ref([]);

const getMoneyList = async () => {
  const res = await axios.get(`/api/users/${loginStore.user.id}`);
  LatestList.value = res.data.moneyList;
  console.log(LatestList.value);
};
getMoneyList();
</script>
