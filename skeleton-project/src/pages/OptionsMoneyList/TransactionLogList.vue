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
        <tr v-for="value in moneyList" :key="value.id">
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
import { ref, onMounted } from "vue";
import { useMoneyStore } from "@/stores/money";
import axios from "axios";
import EditTransactionModal from "@/components/EditTransactionModal.vue"; // 수정 모달 컴포넌트 불러오기
const loginStore = useLoginStore();
const props = defineProps({
  startDate: String,
  endDate: String,
});

const allMoneyList = ref([]);
const moneyList = ref([]);
const moneyStore = useMoneyStore();
const showEditModal = ref(false); // 수정 모달의 표시 여부 (true면 열림, false면 닫힘)
const editData = ref(null); // 수정 버튼을 누른 row의 거래 데이터를 임시 저장

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
</style>
