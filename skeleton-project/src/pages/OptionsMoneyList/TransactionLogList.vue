<template>
  <div>
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
        <tr v-for="value in paginatedList" :key="value.id">
          <td>{{ value.date }}</td>
          <td>{{ value.type }}</td>
          <td>
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
            <!-- 수정 버튼: 클릭하면 해당 row의 전체 데이터(value)를 openEditModal에 넘김 -->
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

    <!-- 페이지네이션 -->
    <div v-if="totalPages > 1" class="pagination-wrap">
      <button
        v-if="currentPage > 1"
        class="page-btn nav-btn"
        @click="currentPage--"
      >
        prev
      </button>
      <button
        v-for="page in visiblePages"
        :key="page"
        class="page-btn"
        :class="{ active: page === currentPage }"
        @click="currentPage = page"
      >
        -{{ page }}-
      </button>
      <button
        v-if="currentPage < totalPages"
        class="page-btn nav-btn"
        @click="currentPage++"
      >
        next
      </button>
    </div>
  </div>

  <!-- showEditModal이 true일 때만 모달 렌더링 -->
  <!-- :editData → 수정할 거래 데이터를 모달 안으로 prop으로 전달 -->
  <!-- @close → 모달 내부에서 $emit('close') 하면 onEditClose 실행 -->
  <EditTransactionModal
    v-if="showEditModal"
    :editData="editData"
    @close="onEditClose"
  />
</template>
<script setup>
import { useLoginStore } from "@/stores/login";
import { ref, computed, onMounted } from "vue";
import { useMoneyStore } from "@/stores/money";
import axios from "axios";
import EditTransactionModal from "@/components/EditTransactionModal.vue"; // 수정 모달 컴포넌트 불러오기
const loginStore = useLoginStore();
const props = defineProps({
  startDate: String,
  endDate: String,
});

const ITEMS_PER_PAGE = 12;
const currentPage = ref(1);

const allMoneyList = ref([]);
const moneyList = ref([]);
const moneyStore = useMoneyStore();
const showEditModal = ref(false); // 수정 모달의 표시 여부 (true면 열림, false면 닫힘)
const editData = ref(null); // 수정 버튼을 누른 row의 거래 데이터를 임시 저장

const totalPages = computed(() =>
  Math.ceil(moneyList.value.length / ITEMS_PER_PAGE),
);

const paginatedList = computed(() => {
  const start = (currentPage.value - 1) * ITEMS_PER_PAGE;
  return moneyList.value.slice(start, start + ITEMS_PER_PAGE);
});

// 현재 페이지를 가운데 기준으로 최대 3개 페이지 번호를 표시
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

// 수정 버튼 클릭 시 실행
// item = 클릭한 row의 거래 데이터 (value 전체)
const openEditModal = (item) => {
  editData.value = item; // 해당 거래 데이터를 editData에 저장 → 모달에 prop으로 전달됨
  showEditModal.value = true; // 모달 열기
};

// 날짜 필터 + 최신순 정렬을 한 번에 처리하는 함수
// onMounted와 onEditClose 둘 다 이 함수를 호출해서 동일한 로직 보장
const applyList = () => {
  const isVaildDate = (dateStr) => !isNaN(new Date(dateStr));

  if (isVaildDate(props.startDate) && isVaildDate(props.endDate)) {
    moneyList.value = allMoneyList.value.filter((item) => {
      const itemDate = new Date(item.date);
      const start = new Date(props.startDate);
      const end = new Date(props.endDate);
      return itemDate >= start && itemDate <= end;
    });
  } else {
    moneyList.value = [...allMoneyList.value];
  }

  // 최신순 정렬 (날짜 내림차순)
  moneyList.value.sort((a, b) => new Date(b.date) - new Date(a.date));

  currentPage.value = 1; // 필터 변경 시 첫 페이지로 초기화
};

// 모달 안에서 $emit('close') 했을 때 실행
const onEditClose = async () => {
  showEditModal.value = false; // 모달 닫기
  await moneyStore.loadData(); // 최신 데이터를 스토어에서 다시 불러오기
  allMoneyList.value = [...moneyStore.userMoneyList]; // 전체 목록 갱신
  applyList(); // 필터 + 정렬 재적용
};

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
  applyList(); // 필터 + 정렬 적용
});
</script>
<style scoped>
.btn-xs {
  padding: 0.1rem 0.4rem;
  font-size: 0.75rem;
}

.pagination-wrap {
  display: flex;
  justify-content: center;
  gap: 0.25rem;
  margin-top: 0.75rem;
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
</style>

<!--
  ===== 변수명 용도 설명 =====

  [props]
  - props         : defineProps로 정의된 부모 컴포넌트 전달값 객체.
  - startDate     : 부모(TransactionLogLatest)에서 전달받는 조회 시작일 문자열('YYYY-MM-DD').
                    applyList에서 날짜 필터 범위의 시작 기준으로 사용됨.
  - endDate       : 부모(TransactionLogLatest)에서 전달받는 조회 종료일 문자열('YYYY-MM-DD').
                    applyList에서 날짜 필터 범위의 종료 기준으로 사용됨.

  [스토어 변수]
  - loginStore    : useLoginStore()로 가져온 로그인 스토어.
                    deleteItem에서 현재 로그인 유저의 id(loginStore.user.id)를 참조하는 데 사용됨.
  - moneyStore    : useMoneyStore()로 가져온 가계부 스토어.
                    onMounted·onEditClose에서 loadData()로 최신 데이터를 불러오고
                    userMoneyList로 전체 거래 목록을 읽는 데 사용됨.

  [ref 상태 변수]
  - allMoneyList  : 서버에서 불러온 전체 거래 내역 원본 배열.
                    applyList에서 필터링의 소스로 사용되며, deleteItem 시 직접 갱신됨.
  - moneyList     : allMoneyList에 날짜 필터와 최신순 정렬을 적용한 결과 배열.
                    paginatedList의 소스로 사용되며, applyList 호출 시 갱신됨.
  - showEditModal : EditTransactionModal 표시 여부. true이면 거래 수정 모달이 열림.
  - editData      : 수정 버튼을 클릭한 row의 거래 데이터를 임시 저장.
                    EditTransactionModal에 :editData prop으로 전달됨. 초기값 null.
  - currentPage   : 현재 표시 중인 페이지 번호. 초기값 1.
                    applyList 호출 시 1로 초기화됨.

  [상수]
  - ITEMS_PER_PAGE : 한 페이지에 표시할 최대 항목 수. 현재 12로 고정.

  [computed 변수]
  - totalPages    : moneyList 길이를 ITEMS_PER_PAGE로 나눠 올림한 전체 페이지 수.
                    페이지네이션 버튼 렌더링 여부(v-if)와 visiblePages 계산에 사용됨.
  - paginatedList : currentPage 기준으로 moneyList를 슬라이싱한 배열.
                    테이블의 v-for 데이터 소스로 화면에 표시됨.
  - visiblePages  : 현재 페이지를 가운데로 최대 3개의 페이지 번호 배열.
                    currentPage ± 1 범위로 계산되며, 범위가 경계를 벗어나면 보정함.

  [const 함수 변수]
  - openEditModal : 수정 버튼 클릭 핸들러. 클릭한 row의 데이터를 editData에 저장하고 showEditModal을 true로 설정.
  - applyList     : 날짜 필터링과 최신순 정렬을 한 번에 처리하는 함수.
                    props.startDate·endDate가 유효한 날짜이면 해당 범위로 필터링하고,
                    유효하지 않으면 전체 목록을 그대로 사용한 뒤 날짜 내림차순 정렬.
                    실행 후 currentPage를 1로 초기화함.
                    onMounted와 onEditClose에서 공통 호출됨.
  - onEditClose   : EditTransactionModal의 @close 이벤트 핸들러.
                    모달을 닫고 스토어 데이터 재로드 → allMoneyList 갱신 → applyList() 재적용 순으로 실행.
  - deleteItem    : 삭제 버튼 클릭 핸들러. allMoneyList·moneyList에서 해당 항목을 제거하고
                    서버에 PATCH 요청으로 변경 내용을 반영함.

  [openEditModal 매개변수]
  - item          : 수정 버튼을 클릭한 row의 거래 데이터 객체(value 전체). editData에 저장됨.

  [applyList 내부 지역 변수]
  - isVaildDate   : 날짜 문자열이 유효한 날짜인지 검사하는 내부 함수. (오타 주의: isValid → isVaild)
                    new Date(dateStr)가 NaN이 아니면 유효한 날짜로 판단함.
  - itemDate      : 각 거래 항목의 date 값을 Date 객체로 변환한 것. 필터 범위 비교에 사용됨.
  - start         : props.startDate를 Date 객체로 변환한 것. 필터 범위의 시작 기준.
  - end           : props.endDate를 Date 객체로 변환한 것. 필터 범위의 종료 기준.

  [deleteItem 매개변수 및 내부 지역 변수]
  - id            : 삭제할 거래 항목의 고유 id. deleteItem 함수의 매개변수.
  - updatedList   : allMoneyList에서 해당 id를 제외한 새 배열.
                    서버 PATCH 요청 body로 전달되어 삭제 내용을 서버에 반영함.

  [템플릿 루프 변수]
  - value         : v-for에서 paginatedList를 순회할 때 각 거래 항목을 가리키는 반복 변수.
                    date, type, category, title, userMoney, id 프로퍼티를 템플릿에서 사용함.
  - page          : v-for에서 visiblePages를 순회할 때 각 페이지 번호를 가리키는 반복 변수.
                    페이지네이션 버튼의 텍스트 및 active 클래스 바인딩에 사용됨.
-->
