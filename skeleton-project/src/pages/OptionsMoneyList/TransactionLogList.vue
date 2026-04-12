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
          <!-- <tr v-for="value in filteredList" :key="value.listId"> 내가 좀 건들여봤는데 다 못했으.. 모르겠으면 그냥 주석 지워  -->
          <td>{{ value.date }}</td>
          <td>{{ value.type }}</td>
          <td>{{ value.title }}</td>
          <td>{{ value.category }}</td>
          <td>{{ value.userMoney }}</td>
          <td><button @click="deleteItem(value.id)">삭제</button></td>
        </tr>
      </tbody>
    </table>
  </div>
</template>
<script setup>
import { useLoginStore } from "@/stores/login";
import { ref, onMounted } from "vue";
import { useMoneyStore } from "@/stores/money";
import axios from "axios";
// import { useMoneyStore } from "@/stores/money";

// const moneyStore = useMoneyStore();
const loginStore = useLoginStore();
const props = defineProps({
  startDate: String,
  endDate: String,
});

const allMoneyList = ref([]);
const moneyList = ref([]);
const moneyStore = useMoneyStore();

const deleteItem = async (id) => {
  const updatedList = allMoneyList.value.filter((item) => item.id !== id);
  allMoneyList.value = updatedList;
  moneyList.value = moneyList.value.filter((item) => item.id !== id);
  await axios.patch(`/api/users/${loginStore.user.id}`, {
    moneyList: updatedList,
  });
};

onMounted(async () => {
  await moneyStore.loadData();
  allMoneyList.value = [...moneyStore.userMoneyList];
  moneyList.value = [...moneyStore.userMoneyList];

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
});
</script>
