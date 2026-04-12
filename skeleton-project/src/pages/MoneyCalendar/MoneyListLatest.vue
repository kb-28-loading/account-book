<script setup>
import AddTransactionModal from "@/components/AddTransactionModal.vue"; // 자식 가져오기
import EditTransactionModal from "@/components/EditTransactionModal.vue"; // 자식 가져오기
import { ref, onMounted, computed, watch, onBeforeUpdate } from "vue";
import { useLoginStore } from "@/stores/login";
import { useMoneyStore } from "@/stores/money";
import axios from "axios";

const loginStore = useLoginStore();
const moneyStore = useMoneyStore();

// ============================================================
// db.json에서 데이터 가져오기
const LatestList = computed(() => {
  // 창고 데이터를 복사해서 사용합니다 (원본 보호)
  const list = [...moneyStore.userMoneyList];

  if (isSorted.value) {
    return list.sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순
  } else {
    return list.sort((a, b) => new Date(a.date) - new Date(b.date)); // 과거순
  }
});

// 정렬 버튼 함수 (데이터를 직접 건드리지 않고, 스위치만 껐다 켭니다)
const clickedPlus = () => {
  isSorted.value = !isSorted.value;
};

// =============================================================
// 정렬 버튼
const isSorted = ref(true);

// ==========================================================
// 팝업창 열고 닫기 부분
const isModalOpen = ref(false); /* 팝업창의 열림/닫힘 상태를 저장할 변수 */
const AddList = () => {
  isModalOpen.value = true;
};

const isModaClose = () => {
  isModalOpen.value = false;
  editModalOpen.value = false;
};
// ==========================================================
// 삭제 기능
const deleteList = async (targetid) => {
  console.log(targetid);

  if (!confirm("정말 삭제하시겠습니까?")) return;

  const userId = loginStore.user.id;

  try {
    const res = await axios.get(`/api/users/${userId}`);
    console.log("userId 값 가져오기", res);

    const currentUser = res.data.moneyList;
    console.log("currentUser에 res.data넣기", currentUser);

    const updatedMoneyList = currentUser.filter(
      (item) => item.id !== Number(targetid),
    );
    console.log("updatedMoneyList", updatedMoneyList);

    // 3. 서버에 PATCH 요청을 보냅니다.
    await axios.patch(`/api/users/${userId}`, {
      moneyList: updatedMoneyList,
    });
    console.log("삭제 성공 >_<");

    await moneyStore.loadData();
  } catch {
    console.log("삭제 실패 0_0..");
  }
};
// =========================================================
// 클릭 이벤트 데이터 보내기

const editData = ref(null); /* 수정할 데이터를 담을 바구니 */
const editModalOpen = ref(false);

// 수정 버튼 클릭 함수
const editList = (item) => {
  editData.value = item; // 클릭한 행의 데이터를 담고
  console.log("수정 할 데이터 기존 값", item);

  editModalOpen.value = true; // 모달을 엽니다
};
// ========================================================
</script>

<template>
  <div
    class="card shadow-sm rounded-4 p-3 position-relative list-container custom-border"
  >
    <div class="d-flex justify-content-between align-items-center mb-3">
      <h5 class="fw-bold m-0 text-purple">전체 거래내역</h5>
      <button class="btn btn-outline-purple btn-sm" @click="clickedPlus">
        {{ isSorted ? "과거순정렬" : "최신순정렬" }}
      </button>
    </div>

    <div class="table-responsive">
      <table class="table table-hover align-middle text-center custom-table">
        <thead>
          <tr>
            <th>거래명</th>
            <th>카테고리</th>
            <th>타입</th>
            <th>금액</th>
            <th>날짜</th>
            <th>기능</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in LatestList" :key="value.id">
            <td class="text-start ps-3 fw-bold">{{ value.title }}</td>
            <td>
              <span class="badge bg-light text-dark">{{ value.category }}</span>
            </td>
            <td>{{ value.type }}</td>
            <td
              :class="value.type === '수입' ? 'text-primary' : 'text-danger'"
              class="fw-bold"
            >
              {{ value.userMoney.toLocaleString() }}
            </td>
            <td class="text-muted small">{{ value.date }}</td>
            <td>
              <div class="btn-group gap-1">
                <button
                  class="btn btn-xs btn-outline-secondary"
                  @click="editList(value)"
                >
                  수정
                </button>
                <button
                  class="btn btn-xs btn-outline-danger"
                  @click="deleteList(value.id)"
                >
                  삭제
                </button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <button
      class="btn btn-purple rounded-circle shadow-lg position-absolute add-btn"
      @click="AddList"
    >
      <i class="fa-solid fa-plus"></i>
    </button>

    <AddTransactionModal v-if="isModalOpen" @close="isModaClose" />
    <EditTransactionModal
      v-if="editModalOpen"
      :editData="editData"
      @close="isModaClose"
    />
  </div>
</template>
<style scoped>
/* 보라색 테마 설정 */
.text-purple {
  color: #bfa5d4;
}
.btn-purple {
  background-color: #bfa5d4;
  color: white;
  border: none;
}
.btn-purple:hover {
  background-color: #a98bc4;
  color: white;
}
.btn-outline-purple {
  color: #bfa5d4;
  border-color: #bfa5d4;
}

/* 1. 👇 테두리 설정 (달력과 동일하게 #BFA5D4, 2px) */
.custom-border {
  border: 2px solid #bfa5d4 !important;
}

/* 2. 👇 목록 컨테이너 높이 맞추기 */
.list-container {
  height: 100%; /* 부모 col 높이에 꽉 차게 */
  display: flex;
  flex-direction: column;
  background-color: white;
}

/* 3. 👇 테이블 영역이 남은 높이를 다 쓰도록 설정 */
.table-responsive {
  flex: 1; /* 헤더 제외 남은 공간 다 차지 */
  overflow-y: auto;
  margin-bottom: 10px;
}

/* 플러스 버튼 위치 조정 */
.add-btn {
  width: 50px; /* 칸이 좁아졌으므로 크기 살짝 조절 */
  height: 50px;
  right: 20px;
  bottom: 20px;
  font-size: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.custom-table {
  font-size: 0.85rem;
}
.btn-xs {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
}

/* 스크롤바 디자인 */
.table-responsive::-webkit-scrollbar {
  width: 5px;
}
.table-responsive::-webkit-scrollbar-thumb {
  background: #dbd0e6;
  border-radius: 10px;
}
</style>
