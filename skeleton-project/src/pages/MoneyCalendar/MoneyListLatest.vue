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
        <tr>
          <td>{{ item.title }}</td>
          <td>{{ item.category }}</td>
          <td>{{ item.date }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { useLoginStore } from '@/stores/login';

const loginStore = useLoginStore();
</script>
