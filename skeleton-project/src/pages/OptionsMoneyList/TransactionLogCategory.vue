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
            <th>카테고리</th>
            <th>거래명</th>
            <th>금액</th>
            <th></th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in resultList" :key="value.id">
            <td>{{ value.date }}</td>
            <td>{{ value.type }}</td>
            <td
              :class="value.type === '수입' ? 'text-primary' : 'text-danger'"
              class="fw-bold"
            >
              <span class="badge bg-light text-dark">{{ value.category }}</span>
            </td>
            <td>{{ value.title }}</td>
            <td
              :class="value.type === '수입' ? 'text-primary' : 'text-danger'"
              class="fw-bold"
            >
              {{ value.userMoney.toLocaleString() }}
            </td>
            <td>
              <div class="btn-group gap-1">
                <button
                  class="btn btn-xs btn-outline-secondary"
                  @click="openEditModal(value)"
                >
                  수정
                </button>
                <button
                  class="btn btn-xs btn-outline-danger"
                  @click="deleteItem(value.id)"
                >
                  삭제
                </button>
              </div>
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

.btn-xs {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
}
</style>

<!--
  ===== 변수명 용도 설명 =====

  [ref 상태 변수]
  - categoryList  : 선택된 타입(수입/지출)에 따라 서버에서 불러온 카테고리 목록 배열.
                    카테고리 선택 <select>의 option 목록으로 v-for 렌더링됨.
  - selected      : 카테고리 <select>에서 현재 선택된 카테고리 값. v-model로 바인딩됨.
  - selectedType  : 타입 <select>에서 현재 선택된 값('수입' | '지출' | '').
                    v-model로 바인딩되며, onTypeChange에서 타입에 맞는 categoryList를 로드하는 데 사용됨.
  - resultList    : 조회 결과로 표시할 거래 내역 배열. 테이블의 v-for 데이터 소스.
  - showModal     : AddTransactionModal 표시 여부. true이면 거래 추가 모달이 열림.
  - showEditModal : EditTransactionModal 표시 여부. true이면 거래 수정 모달이 열림.
  - editData      : 수정 버튼을 클릭한 row의 거래 데이터를 임시 저장.
                    EditTransactionModal에 :editData prop으로 전달됨. 초기값 null.

  [스토어 변수]
  - loginStore    : useLoginStore()로 가져온 로그인 스토어.
                    deleteItem에서 현재 로그인 유저의 id(loginStore.user.id)를 참조하는 데 사용됨.
  - useStore      : useMoneyStore()로 가져온 가계부 스토어.
                    search에서 userMoneyList를 읽고, onEditClose에서 loadData()로 최신 데이터를 재로드하는 데 사용됨.

  [const 함수 변수]
  - openEditModal : 수정 버튼 클릭 핸들러. 클릭한 row의 데이터를 editData에 저장하고 showEditModal을 true로 설정.
  - onEditClose   : EditTransactionModal의 @close 이벤트 핸들러.
                    모달을 닫고 스토어 데이터를 재로드한 뒤 search()로 목록을 재조회함.
  - onTypeChange  : 타입 <select> 변경 핸들러. selectedType에 따라 서버에서 카테고리 목록을 불러와 categoryList에 저장.
  - search        : 조회 버튼 클릭 핸들러. useStore.userMoneyList에서 selected(카테고리)와 일치하는 항목만 필터링해
                    최신순으로 정렬 후 resultList에 저장.
  - deleteItem    : 삭제 버튼 클릭 핸들러. 서버에서 현재 유저 데이터를 가져와 해당 id 항목을 제거하고
                    서버·resultList 양쪽을 모두 갱신함.
  - onModalClose  : AddTransactionModal의 @close 이벤트 핸들러. showModal을 false로 설정해 모달을 닫음.

  [openEditModal 매개변수]
  - item          : 수정 버튼을 클릭한 row의 거래 데이터 객체(value 전체). editData에 저장됨.

  [onTypeChange 내부 지역 변수]
  - response      : selectedType이 '지출'일 때 /api/outcome-category 요청의 응답 객체.
                    response.data를 categoryList에 저장함.
  - typeList      : selectedType이 '수입'일 때 /api/income-category 요청의 응답 객체.
                    typeList.data를 categoryList에 저장함.

  [deleteItem 매개변수 및 내부 지역 변수]
  - id            : 삭제할 거래 항목의 고유 id. deleteItem 함수의 매개변수.
  - response      : /api/users/:id GET 요청의 응답 객체. 현재 유저의 전체 데이터를 담음.
  - updatedList   : response.data.moneyList에서 해당 id를 제외한 새 배열.
                    서버 PATCH 요청 body로 전달되어 삭제 내용을 서버에 반영함.

  [템플릿 루프 변수]
  - value         : v-for에서 resultList를 순회할 때 각 거래 항목을 가리키는 반복 변수.
                    date, type, category, title, userMoney, id 프로퍼티를 템플릿에서 사용함.
  - category      : v-for에서 categoryList를 순회할 때 각 카테고리 문자열을 가리키는 반복 변수.
-->

