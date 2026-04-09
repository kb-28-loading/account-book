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
const emit = defineEmits(["latest"]);
const moneyList = ref([]);

onMounted(async () => {
  const response = await axios.get("/api/users/2");
  moneyList.value = response.data.moneyList;

  const isVaildDate = (dateStr) => !isNaN(new Date(dateStr));

  if (isVaildDate(props.startDate) && isVaildDate(props.endDate)) {
    moneyList.value = moneyList.value.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(props.startDate);
      const end = new Date(props.endDate);
      return itemDate >= start && itemDate <= end;
    });
  }

  moneyList.value.sort((a, b) => {
    return new Date(b.date) - new Date(a.date);
  });
  emit("latest", moneyList);
});
// const loginStore = useLoginStore();
// const moneyList = loginStore.user.moneyList;
// console.log(moneyList);
</script>
