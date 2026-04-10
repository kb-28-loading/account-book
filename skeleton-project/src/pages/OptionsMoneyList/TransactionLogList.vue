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
          <td><button @click="deleteItem(value.listId)">삭제</button></td>
        </tr>
      </tbody>
    </table>
    <button @click="AddList">+</button>
    <AddTransactionModal
      v-if="isModalOpen === true"
      @post="getMoneyList"
      @close="isModaClose"
    />
  </div>
</template>
<script setup>
import { useLoginStore } from "@/stores/login";
import { ref, onMounted } from "vue";
import axios from "axios";
import AddTransactionModal from "@/components/AddTransactionModal.vue";

const loginStore = useLoginStore();
const props = defineProps({
  startDate: String,
  endDate: String,
});
const emit = defineEmits(["latest"]);
const allMoneyList = ref([]);
const moneyList = ref([]);

const deleteItem = async (listId) => {
  moneyList.value = moneyList.value.filter((item) => item.listId !== listId);
  allMoneyList.value = allMoneyList.value.filter(
    (item) => item.listId !== listId,
  );
  await axios.patch(`/api/users/${loginStore.user.id}`, {
    moneyList: allMoneyList.value,
  });
};

onMounted(async () => {
  const response = await axios.get(`/api/users/${loginStore.user.id}`); // 수정 전
  allMoneyList.value = response.data.moneyList;
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
const isModalOpen = ref(false); /* 팝업창의 열림/닫힘 상태를 저장할 변수 */
const AddList = () => {
  isModalOpen.value = true;
};

const isModaClose = () => {
  isModalOpen.value = false;
};
const LatestList = ref([]);

const getMoneyList = async () => {
  const res = await axios.get(`/api/users/${loginStore.user.id}`);
  LatestList.value = res.data.moneyList;
  console.log("데이터 로드 성공:", LatestList.value);
};
</script>
