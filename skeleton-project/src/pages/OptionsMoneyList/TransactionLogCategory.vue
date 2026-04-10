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

    <div>{{ selected }}</div>

    <select v-model="selected">
      <option value="">카테고리를 선택하세요.</option>
      <option v-for="category in categoryList" :value="category">
        {{ category }}
      </option>
    </select>
    <div><button>조회</button></div>
    <div><table></table></div>
  </div>
</template>
<script setup>
import { ref } from "vue";
import axios from "axios";

const categoryList = ref([]);
const selected = ref("");
const selectedType = ref("");

const onTypeChange = async () => {
  if (selectedType.value === "수입") {
    const response = await axios.get("/api/income-category");
    categoryList.value = response.data;
  } else if (selectedType.value === "지출") {
    const response = await axios.get("/api/outcome-category");
    categoryList.value = response.data;
  }
};
</script>
