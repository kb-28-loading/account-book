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
import { ref, onMounted, computed } from "vue";
import axios from "axios";
// import { useMoneyStore } from "@/stores/money";

// const moneyStore = useMoneyStore();
const loginStore = useLoginStore();
const props = defineProps({
  startDate: String,
  endDate: String,
});
const emit = defineEmits(["latest"]);
const allMoneyList = ref([]);
const moneyList = ref([]);

const deleteItem = async (id) => {
  const updatedList = allMoneyList.value.filter((item) => item.id !== id);
  allMoneyList.value = updatedList;
  moneyList.value = moneyList.value.filter((item) => item.id !== id);
  await axios.patch(`/api/users/${loginStore.user.id}`, {
    moneyList: updatedList,
  });
};

onMounted(async () => {
  const response = await axios.get(`/api/users/${loginStore.user.id}`);
  allMoneyList.value = response.data.moneyList ?? [];
  moneyList.value = [...allMoneyList.value];

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
// ==================================================
// 반응이 있을때마다 목록을 로드해서 띄움 (이 코드도 모르겠으면 그냥 이 아래 다 지우면 됨)
// const filteredList = computed(() => {

//   // 창고 데이터가 없으면 빈 배열(창고데이터는 pinia에 있는것 -> money.js)
//   if (!moneyStore.userMoneyList) return [];

//   let list = [...moneyStore.userMoneyList];

//   // 날짜 유효성 검사 함수(이건 내가 뭔지 몰라서 ai가 가져와줌)
//   const isValidDate = (dateStr) => !isNaN(new Date(dateStr)) && dateStr.includes('-');

//   // 날짜 필터링 (부모가 준 startDate, endDate가 있을 때만)
//   if (isValidDate(props.startDate) && isValidDate(props.endDate)) {
//     list = list.filter((item) => {

//       // 날짜 조건에 해당하는 값 담기
//       return item.date >= props.startDate && item.date <= props.endDate;
//     });
//     // 최신순 정렬
//     list.sort((a, b) => new Date(b.date) - new Date(a.date));

//     return list;
//   }
// });
// // 부모에게 최신 데이터를 알려주는 역할 (필요할 때만 감시)
// import { watch } from 'vue';
// watch(filteredList, (newList) => {
//   emit("latest", { value: newList });
// }, { immediate: true });
</script>
