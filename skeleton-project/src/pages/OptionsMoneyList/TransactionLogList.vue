<template>
  <div>
    <table class="table">
      <thead>
        <tr>
          <th>Date</th>
          <th>타입</th>
          <th>거래명</th>
          <th>카테고리</th>
          <th>금액</th>
          <th></th>
        </tr>
      </thead>
      <tbody>
        <tr v-for="value in moneyList" :key="value.listId">
          <td>{{ value.date }}</td>
          <td>{{ value.type }}</td>
          <td>{{ value.title }}</td>
          <td>{{ value.category }}</td>
          <td>{{ value.userMoney }}</td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
// import { useLoginStore } from "@/stores/login";
import { ref, onMounted } from "vue";
import axios from "axios";
const props = defineProps({
  startDate: String,
  endDate: String,
});

const moneyList = ref([]);

onMounted(async () => {
  const response = await axios.get("/api/users/1");
});
// const loginStore = useLoginStore();
// const moneyList = loginStore.user.moneyList;
// console.log(moneyList);
</script>
