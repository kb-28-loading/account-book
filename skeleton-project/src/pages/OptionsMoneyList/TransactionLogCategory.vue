<template>
  <div>
    <div>
      <h1>거래 내역 조회(CATEGORY)</h1>
      <hr />
    </div>

    <select v-model="selectedType" @change="onTypeChange">
      <option value="">타입 선택</option>
      <option value="수입">수입</option>
      <option value="지출">지출</option>
    </select>

    <select v-model="selected">
      <option value="">카테고리를 선택하세요.</option>
      <option v-for="category in categoryList" :value="category">
        {{ category }}
      </option>
    </select>
    <div><button @click="search">조회</button></div>
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
          <tr v-for="value in resultList" :key="value.id">
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
  </div>
</template>
<script setup>
import { useLoginStore } from "@/stores/login";
import { ref } from "vue";
import axios from "axios";

const categoryList = ref([]);
const selected = ref("");
const selectedType = ref("");
const loginStore = useLoginStore();
const resultList = ref([]);

const onTypeChange = async () => {
  if (selectedType.value === "지출") {
    const response = await axios.get("/api/outcome-category");
    categoryList.value = response.data;
  } else if (selectedType.value === "수입") {
    const typeList = await axios.get("/api/income-category");
    categoryList.value = typeList.data;
  }
};

const search = async () => {
  const response = await axios.get(`/api/users/${loginStore.user.id}`);
  resultList.value = response.data.moneyList.filter(
    (item) => item.category === selected.value,
  );
};
const deleteItem = async (id) => {
  const response = await axios.get(`/api/users/${loginStore.user.id}`);
  const updatedList = response.data.moneyList.filter((item) => item.id !== id);
  resultList.value = resultList.value.filter((item) => item.id !== id);
  await axios.patch(`/api/users/${loginStore.user.id}`, {
    moneyList: updatedList,
  });
};
</script>
