<template>
  <div>
    <div>
      <h1>거래 내역 조회(CATEGORY)</h1>
      <hr class="title-underline" />
    </div>

    <div class="controls-bar">
      <select
        class="filter-select"
        v-model="selectedType"
        @change="onTypeChange"
      >
        <option value="">타입 선택</option>
        <option value="수입">수입</option>
        <option value="지출">지출</option>
      </select>

      <select class="filter-select" v-model="selected">
        <option value="">카테고리를 선택하세요.</option>
        <option v-for="category in categoryList" :value="category">
          {{ category }}
        </option>
      </select>

      <button class="query-btn" @click="search">조회</button>
    </div>

    <div class="options-main-container">
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
            <td>
              <button @click="openEditModal(value)">수정</button>
              <button @click="deleteItem(value.id)">삭제</button>
            </td>
          </tr>
        </tbody>
      </table>
      <div class="add-btn-wrapper">
        <button class="add-btn" @click="showModal = true">+</button>
      </div>
      <AddTransactionModal v-if="showModal" @close="onModalClose" />
    </div>

    <!-- showEditModal이 true일 때만 모달 렌더링 -->
    <!-- :editData → 수정할 거래 데이터를 모달 안으로 prop으로 전달 -->
    <!-- @close → 모달 내부에서 $emit('close') 하면 onEditClose 실행 -->
    <EditTransactionModal
      v-if="showEditModal"
      :editData="editData"
      @close="onEditClose"
    />
  </div>
</template>
<script setup>
import { useLoginStore } from "@/stores/login";
import { useMoneyStore } from "@/stores/money";
import { ref } from "vue";
import axios from "axios";
import AddTransactionModal from "@/components/AddTransactionModal.vue";
import EditTransactionModal from "@/components/EditTransactionModal.vue"; // 수정 모달 컴포넌트 불러오기

const categoryList = ref([]);
const selected = ref("");
const selectedType = ref("");
const loginStore = useLoginStore();
const resultList = ref([]);
const useStore = useMoneyStore();
const showModal = ref(false);
const showEditModal = ref(false); // 수정 모달의 표시 여부 (true면 열림, false면 닫힘)
const editData = ref(null); // 수정 버튼을 누른 row의 거래 데이터를 임시 저장

// 수정 버튼 클릭 시 실행
// item = 클릭한 row의 거래 데이터 (value 전체)
const openEditModal = (item) => {
  editData.value = item; // 해당 거래 데이터를 editData에 저장 → 모달에 prop으로 전달됨
  showEditModal.value = true; // 모달 열기
};

// 모달 안에서 $emit('close') 했을 때 실행
const onEditClose = async () => {
  showEditModal.value = false; // 모달 닫기
  await useStore.loadData(); // 수정된 내용이 반영된 최신 데이터를 스토어에서 다시 불러오기
  search(); // 현재 선택된 카테고리 기준으로 목록 재조회
};

const onTypeChange = async () => {
  if (selectedType.value === "지출") {
    const response = await axios.get("/api/outcome-category");
    categoryList.value = response.data;
  } else if (selectedType.value === "수입") {
    const typeList = await axios.get("/api/income-category");
    categoryList.value = typeList.data;
  }
};
const search = () => {
  resultList.value = useStore.userMoneyList
    .filter((item) => item.category === selected.value)
    .sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순 정렬
};
const deleteItem = async (id) => {
  const response = await axios.get(`/api/users/${loginStore.user.id}`);
  const updatedList = response.data.moneyList.filter((item) => item.id !== id);
  resultList.value = resultList.value.filter((item) => item.id !== id);
  await axios.patch(`/api/users/${loginStore.user.id}`, {
    moneyList: updatedList,
  });
};

const onModalClose = () => {
  showModal.value = false;
};
</script>
<style scoped>
.controls-bar {
  display: flex;
  align-items: center;
  gap: 12px;
  margin-bottom: 16px;
}

.filter-select {
  border: 1.5px solid #bfa5d4;
  border-radius: 999px;
  background: white;
  padding: 6px 18px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
  color: #3d3d3d;
  appearance: auto;
}

.query-btn {
  border: none;
  border-radius: 999px;
  background-color: #bfa5d4;
  color: white;
  padding: 6px 16px;
  cursor: pointer;
  font-family: inherit;
  font-size: 14px;
}

.query-btn:hover {
  background-color: #a98bc4;
}

.add-btn-wrapper {
  display: flex;
  justify-content: flex-end;
  padding: 16px 16px 0;
}

.add-btn {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  border: none;
  background-color: #bfa5d4;
  color: white;
  font-size: 28px;
  line-height: 1;
  cursor: pointer;
  box-shadow: 0 4px 10px rgba(0, 0, 0, 0.15);
}

.add-btn:hover {
  background-color: #a98bc4;
}
</style>
