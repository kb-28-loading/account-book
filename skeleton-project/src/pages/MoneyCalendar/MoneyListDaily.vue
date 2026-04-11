<script setup>
import AddTransactionModal from '@/components/AddTransactionModal.vue'; // 자식 가져오기
import EditTransactionModal from '@/components/EditTransactionModal.vue'; // 자식 가져오기
import { ref, watch, onMounted } from 'vue';
import { useLoginStore } from '@/stores/login';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const currentRoute = useRoute();
const loginStore = useLoginStore();

// =======================================================
// 주소 바뀌면 해당 주소에 맞는 값들 보여주기
watch(
  () => currentRoute.params.selectedDate,
  // currentRoute : 현재 페이지 정보
  // selectedDate : 캘린더에서 params값
  // 해당 값이 변하면 작동
  (newDate) => {
    if (newDate) getFilteredList(newDate.toString());
    // 새로운값(새로운 곳으로 이동) -> 새로운 주소를 문자열로 바꿔 getFilteredList함수로 보냄
    // 새로운 주소와 login.js에서 일치하는 값 dailyList에 담기
    console.log('변경 감지');
  },
);
// watch함수
// 1.
// watch([a, b]),([newA, newB]) => { 함수 })
// a,b둘다 감시 둘중하나라도 바뀌면 함수 실행
// 2.
// watch(변수, (newVal) => { 함수A })
// 변수를 지켜보고 값이 바뀌면 함수A 작동

const dailyList = ref([]);

// 같은 날에 있는 값들 챙기기
const getFilteredList = async (date) => {
  const resp = await axios.get(`/api/users/${loginStore.user.id}`);
  dailyList.value = resp.data.moneyList.filter((item) => item.date === date);
};
// ========================================================
// 처음 주소로 들어갔을 때 작동 할 상황을 대비해 페이지 첫 로드되면 목록 출력
onMounted(() => {
  const defaultDate = currentRoute.params.selectedDate;
  // defaultDate에 현재 주소값을 넣음

  if (defaultDate) {
    getFilteredList(defaultDate.toString());
    // 날짜가 있으면: 데이터만 가져온다 (화면 유지)
    // + /home에 뒷부분이 있다면 작동
  } else {
    router.push('/login');
    // 날짜가 아예 없으면: 홈으로 보낸다
  }
});
// =========================================================
// 부모에서 자식에게 데이터 보내기

const editData = ref(null);/* 수정할 데이터를 담을 바구니 */
const editModalOpen = ref(false);

// 수정 버튼 클릭 함수
const editList = (item) => {
  editData.value = item; // 클릭한 행의 데이터를 담고
  console.log("수정 할 데이터 기존 값", item);

  editModalOpen.value = true; // 모달을 엽니다
};
// ==========================================================
// 삭제 기능
const deleteList = async (targetid) => {
  console.log(targetid);

  if (!confirm("정말 삭제하시겠습니까?")) return;

  const userId = loginStore.user.id;

  try {
    const res = await axios.get(`/api/users/${userId}`);
    console.log('userId 값 가져오기', res);

    const currentUser = res.data.moneyList;
    console.log('currentUser에 res.data넣기', currentUser);

    const updatedMoneyList = currentUser.filter((item) => item.id !== Number(targetid));
    console.log("updatedMoneyList", updatedMoneyList);

    // 3. 서버에 PATCH 요청을 보냅니다.
    await axios.patch(`/api/users/${userId}`, {
      moneyList: updatedMoneyList,
    });
    console.log("삭제 성공 >_<");

    getFilteredList();

  } catch {
    console.log("삭제 실패 0_0..");

  }
}
// =============================================================
// 정렬 버튼
const isSorted = ref(true);

const clickedPlus = () => {
  if (!isSorted.value) {
    LatestList.value.sort((a, b) => new Date(b.date) - new Date(a.date));
    console.log('최신순정렬');

    isSorted.value = true;
  } else {
    LatestList.value.sort((a, b) => new Date(a.date) - new Date(b.date));
    console.log('과거순 정렬');
    isSorted.value = false;
  }
};
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
// ========================================================
</script>

<template>
  <div>해당 날짜에 해당하는 거래내역</div>
  <div>
    <button @click="clickedPlus">
      {{ isSorted ? '과거순정렬' : '최신순정렬' }}
    </button>
    <table class="table">
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
        <tr v-for="value in dailyList" :key="value.listId">
          <td>{{ value.title }}</td>
          <td>{{ value.category }}</td>
          <td>{{ value.type }}</td>
          <td>{{ value.userMoney }}</td>
          <td>{{ value.date }}</td>
          <td><button @click="editList(value)">수정</button><button @click="deleteList(value.id)">삭제</button></td>
        </tr>
      </tbody>
    </table>
    <!-- 목록 추가 버튼 -->
    <button @click="AddList">+</button>
    <AddTransactionModal v-if="isModalOpen === true" @post="getMoneyList" @close="isModaClose" />
    <EditTransactionModal v-if="editModalOpen === true" :editData="editData" @post="getMoneyList"
      @close="isModaClose" />
  </div>
</template>
