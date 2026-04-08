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
        <router-link
          :to="{ name: 'moneyItem' }"
          v-for="item in loginStore.user.moneyList"
          ><tr>
            <td>{{ item.title }}</td>
            <td>{{ item.category }}</td>
            <td>{{ item.date }}</td>
          </tr></router-link
        >
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';

const loginStore = useLoginStore();
</script>
