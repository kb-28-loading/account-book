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
        <tr v-for="value in dddd" :key="value.listId">
          <td>{{ value.title }}</td>
          <td>{{ value.category }}</td>
          <td>{{ value.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';

const loginStore = useLoginStore();
const dddd = loginStore.user.moneyList;
console.log(dddd);
</script>
