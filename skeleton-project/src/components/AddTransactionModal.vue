<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/login';
import { useMoneyStore } from '@/stores/money';

const moneyStore = useMoneyStore();
const loginStore = useLoginStore();
const emit = defineEmits(['post', 'close']);
// ====================================================
// 카테고리 별 정보담기

const inCategories = ref({ 'income-category': [] });
const outCategories = ref({ 'outcome-category': [] });
const account = ref([]);

onMounted(async () => {
  const income = await axios.get('/api/income-category');
  const outcome = await axios.get('/api/outcome-category');
  const res = await axios.get(`/api/users/${loginStore.user.id}`);
  inCategories.value = income.data;
  outCategories.value = outcome.data;
  account.value = res.data.account;

  console.log('수입데이터 받아오기', inCategories);
  console.log('지출데이터 받아오기', outCategories);
  console.log('결제수단 데이터 받아오기', account);
});

// =======================================================
// 입력되는 값 받아서 db.json에 보내기

// 1. 각각의 입력값을 담을 바구니(ref) 선언
const title = ref('');
const selectedDate = ref('2026-04-10'); // 기본값 설정
const userMoney = ref(0);
const selectedCategory = ref('');
const memo = ref('');
const accountInfo = ref('');
const id = ref(0);

const saveBtn = async () => {
  const newList = {
    title: title.value,
    date: selectedDate.value,
    userMoney: userMoney.value,
    type: categoryOn.value ? '지출' : '수입',
    category: selectedCategory.value,
    id: Date.now(),
    memo: memo.value,
    accountInfo: accountInfo.value,
  };

  if (!userMoney.value) {
    alert('금액을 입력해주세요');
    return;
  }
  if (!selectedCategory.value) {
    alert('카테고리를 입력해주세요');
    return;
  }
  if (!title.value) {
    alert('거래명을 입력해주세요');
    return;
  }
  if (!accountInfo.value) {
    alert('결제수단을 선택해주세요')
    return;
  }

  // 1. 현재 로그인한 유저의 기존 정보를 먼저 가져옴
  const userId = loginStore.user.id;

  try {
    const res = await axios.get(`/api/users/${userId}`);
    const currentUser = res.data;
    console.log('userId 값 가져오기', res);
    console.log('currentUser에 res.data넣기', currentUser);

    // 2. 기존의 moneyList 배열에 새로운 항목(newList)을 추가합니다.
    const updatedMoneyList = [...currentUser.moneyList, newList];

    // 3. 서버에 "이 유저의 moneyList만 이걸로 바꿔줘!"라고 PATCH 요청을 보냅니다.
    await axios.patch(`/api/users/${userId}`, {
      moneyList: updatedMoneyList,
    });
    // patch('위치', {K : V}) : 위치에 k 위치에 v값으로 바꿈

    console.log('저장 성공 0_<');
    await moneyStore.loadData();
    emit('close');
    alert("저장완료");
  } catch (err) {
    console.log('저장 실패 0_0....', err);
    alert("저장실패");
  }
};
// ==============================================================
// 버튼 누으면 카테고리 바뀌기
const categoryOn = ref('');
const income = () => {
  categoryOn.value = false;
  console.log('수입');
};
const onCome = () => {
  categoryOn.value = true;
  console.log('지출');
};
</script>

<template>
  <div class="modal-overlay">
    <div class="modal-content">
      <h3>
        거래명과 연동<button style="float: right" @click="$emit('close')">
          X
        </button>
      </h3>
      <div>금액</div>
      <input v-model="userMoney" type="number" />

      <br />

      <span>
        <button @click="income">수입</button><button @click="onCome">지출</button>
      </span>

      <div>카테고리</div>
      <select v-if="!categoryOn" v-model="selectedCategory">
        <option value="">수입 카테고리를 선택하세요</option>
        <option v-for="item in inCategories" :key="item">{{ item }}</option>
      </select>
      <select v-if="categoryOn" v-model="selectedCategory">
        <option value="">지출 카테고리를 선택하세요</option>
        <option v-for="item in outCategories" :key="item">{{ item }}</option>
      </select>
      <br />
      <div>거래명</div>
      <input v-model="title" placeholder="거래명" />

      <br />

      <div>결제수단</div>
      <select v-model="accountInfo">
        <option value="">은행 카테고리를 선택하세요</option>
        <option v-for="item in account" :key="item.info" :value="`${item.bank}-${item.info}`"> {{ item.bank }}-{{
          item.info }}
        </option>
      </select>

      <br />

      <div>날짜</div>
      <input type="date" v-model="selectedDate" />

      <br />

      <div>메모</div>
      <textarea v-model="memo"></textarea>

      <br />

      <button @click="saveBtn">저장</button>
    </div>
  </div>
</template>

<style scoped>
/* 팝업 전용 CSS (위에서 설명한 fixed 스타일) */
.modal-overlay {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex;
  justify-content: center;
  align-items: center;
  z-index: 1000;
}

.modal-content {
  background: white;
  padding: 2em;
  border-radius: 20px;
  border: 2px solid #d1c4e9;
}
</style>
