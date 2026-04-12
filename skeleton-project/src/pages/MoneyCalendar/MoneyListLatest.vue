<script setup>
import AddTransactionModal from "@/components/AddTransactionModal.vue";
import EditTransactionModal from "@/components/EditTransactionModal.vue";
import { ref, computed, watch } from "vue";
import { useLoginStore } from "@/stores/login";
import { useMoneyStore } from "@/stores/money";
import axios from "axios";

const loginStore = useLoginStore();
const moneyStore = useMoneyStore();

// ============================================================
// 전체 거래내역 데이터 가져오기 및 날짜순 정렬
const isSorted = ref(true);

const LatestList = computed(() => {
  const list = [...moneyStore.userMoneyList];
  if (isSorted.value) {
    return list.sort((a, b) => new Date(b.date) - new Date(a.date)); // 최신순
  } else {
    return list.sort((a, b) => new Date(a.date) - new Date(b.date)); // 과거순
  }
});

const clickedPlus = () => {
  isSorted.value = !isSorted.value;
};

// ==========================================================
// [추가] 페이지네이션 (11개씩 출력)
const ITEMS_PER_PAGE = 11;
const currentPage = ref(1);

// 전체 페이지 수 계산
const totalPages = computed(() =>
  Math.ceil(LatestList.value.length / ITEMS_PER_PAGE)
);

// 현재 페이지에 해당하는 데이터만 추출
const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return LatestList.value.slice(start, start + ITEMS_PER_PAGE);
});

// 하단에 표시될 페이지 번호 범위 계산 (최대 3개 표시)
const visiblePages = computed(() => {
  const total = totalPages.value;
  const cur = currentPage.value;
  let start = Math.max(1, cur - 1);
  let end = Math.min(total, start + 2);
  if (end - start < 2) start = Math.max(1, end - 2);
  const pages = [];
  for (let i = start; i <= end; i++) pages.push(i);
  return pages;
});

// 정렬 순서가 바뀌면 첫 페이지로 이동
watch(isSorted, () => {
  currentPage.value = 1;
});

// ==========================================================
// 3. 모달 제어 및 CRUD 기능 로직
const isModalOpen = ref(false);      // 추가 모달 상태
const editModalOpen = ref(false);    // 수정 모달 상태
const editData = ref(null);          // 수정할 데이터 객체

const AddList = () => { isModalOpen.value = true; };
const isModaClose = () => { isModalOpen.value = false; editModalOpen.value = false; };

// 수정 버튼 클릭 시 해당 데이터를 모달에 전달하고 열기
const editList = (item) => {
  editData.value = item;
  editModalOpen.value = true;
};

// 데이터 삭제 로직 (API 연동)
const deleteList = async (targetid) => {
  if (!confirm("정말 삭제하시겠습니까?")) return;
  try {
    const res = await axios.get(`/api/users/${loginStore.user.id}`);
    const updatedMoneyList = res.data.moneyList.filter(item => item.id !== Number(targetid));

    // 삭제된 리스트로 사용자 정보 업데이트(Patch)
    await axios.patch(`/api/users/${loginStore.user.id}`, {
      moneyList: updatedMoneyList,
    });

    await moneyStore.loadData();
  } catch {
    console.log("삭제 실패");
  }
};
</script>

<template>
  <div class="card shadow-sm rounded-4 p-3 position-relative list-container custom-border">
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
            <th style="width: 15%">Date</th>
            <th style="width: 10%">타입</th>
            <th style="width: 18%">카테고리</th>
            <th style="width: 20%">거래명</th>
            <th style="width: 15%">금액</th>
            <th style="width: 22%">기능</th>
          </tr>
        </thead>
        <tbody>
          <tr v-for="value in paginatedList" :key="value.id">
            <td class="text-muted small text-truncate" style="max-width: 0;" :title="value.date">
              {{ value.date }}
            </td>

            <td class="text-truncate" style="max-width: 0;" :title="value.type">
              {{ value.type }}
            </td>

            <td>
              <div class="text-truncate" :title="value.category">
                <span class="badge bg-light text-dark">{{ value.category }}</span>
              </div>
            </td>

            <td class="text-start ps-3 fw-bold text-truncate" style="max-width: 0;" :title="value.title">
              {{ value.title }}
            </td>

            <td :class="value.type === '수입' ? 'text-primary' : 'text-danger'" class="fw-bold text-truncate"
              style="max-width: 0;">
              {{ value.userMoney.toLocaleString() }}
            </td>

            <td>
              <div class="btn-group gap-1">
                <button class="btn btn-xs btn-outline-secondary" @click="editList(value)">수정</button>
                <button class="btn btn-xs btn-outline-danger" @click="deleteList(value.id)">삭제</button>
              </div>
            </td>
          </tr>
        </tbody>
      </table>
    </div>

    <div v-if="totalPages > 1" class="pagination-wrap">
      <button v-if="currentPage > 1" class="page-btn nav-btn" @click="currentPage--">prev</button>
      <button v-for="page in visiblePages" :key="page" class="page-btn" :class="{ active: page === currentPage }"
        @click="currentPage = page">
        -{{ page }}-
      </button>
      <button v-if="currentPage < totalPages" class="page-btn nav-btn" @click="currentPage++">next</button>
    </div>

    <button class="btn btn-purple rounded-circle shadow-lg position-absolute add-btn" @click="AddList">
      <i class="fa-solid fa-plus"></i>
    </button>

    <AddTransactionModal v-if="isModalOpen" @close="isModaClose" />
    <EditTransactionModal v-if="editModalOpen" :editData="editData" @close="isModaClose" />
  </div>
</template>

<style scoped>
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

.custom-border {
  border: 2px solid #bfa5d4 !important;
}

/* 👇 핵심 수정 구역: 높이 절대 고정 */
.list-container {
  height: 650px !important;
  max-height: 650px !important;
  /* 강제로 늘어나는 현상 완벽 차단 */
  display: flex;
  flex-direction: column;
  background-color: white;
  border-radius: 20px;
}

.table-responsive {
  flex: 1;
  overflow-y: auto;
  margin-bottom: 10px;
  min-height: 0;
  /* 👇 핵심: flex 자식이 부모 높이를 뚫고 나가는 버그 해결 */
}

.custom-table {
  font-size: 0.85rem;
  table-layout: fixed;
  width: 100%;
}

.btn-xs {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
}

.add-btn {
  width: 50px;
  height: 50px;
  right: 20px;
  bottom: 20px;
  font-size: 20px;
  z-index: 10;
  display: flex;
  align-items: center;
  justify-content: center;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-bottom: 0.5rem;
}

.page-btn {
  background: none;
  border: none;
  padding: 0.2rem 0.4rem;
  font-size: 0.75rem;
  color: #adb5bd;
  cursor: pointer;
  transition: color 0.15s;
}

.page-btn:hover {
  color: #495057;
}

.page-btn.active {
  font-size: 1rem;
  font-weight: bold;
  color: #000;
}

.nav-btn {
  font-size: 0.75rem;
  color: #6c757d;
  padding: 0.2rem 0.6rem;
}

.table-responsive::-webkit-scrollbar {
  width: 5px;
}

.table-responsive::-webkit-scrollbar-thumb {
  background: #dbd0e6;
  border-radius: 10px;
}
</style>