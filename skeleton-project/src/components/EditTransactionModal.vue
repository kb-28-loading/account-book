<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';
import { useLoginStore } from '@/stores/login';
import { useMoneyStore } from '@/stores/money';

const moneyStore = useMoneyStore();
const loginStore = useLoginStore();
const emit = defineEmits(['post', 'close']);
const props = defineProps(['editData']); /* 부모가 준 데이터 받기 MoneyListLatest의 editData */
console.log("editData", props.editData);

// ====================================================
// 담을 곳 생성
const inCategories = ref({ 'income-category': [] });
const outCategories = ref({ 'outcome-category': [] });
const account = ref([]);

onMounted(async () => {
  // 카테고리 별 정보담기
  const income = await axios.get('/api/income-category');
  const outcome = await axios.get('/api/outcome-category');
  const res = await axios.get(`/api/users/${loginStore.user.id}`);
  inCategories.value = income.data;
  outCategories.value = outcome.data;
  account.value = res.data.account;

  console.log("res", res);
  console.log("account", account);

  // 수정 버튼 누른 곳에 원래 있던 값 가져오기
  if (props.editData) {
    console.log("수정할 데이터 받기 성공");

    userMoney.value = props.editData.userMoney;
    title.value = props.editData.title;
    selectedDate.value = props.editData.date;
    accountInfo.value = props.editData.accountInfo
    id.value = props.editData.id;
    memo.value = props.editData.memo

    // 나중에 이해
    categoryOn.value = props.editData.type === '지출';
    selectedCategory.value = props.editData.category;
  }
});
// =======================================================
// 각각의 입력값을 담을 바구니(ref) 선언

const title = ref('');
const selectedDate = ref('2026-04-10'); // 기본값 설정
const userMoney = ref(0);
const selectedCategory = ref('');
const memo = ref('');
const id = ref(0);
const accountInfo = ref('');

// ===============================================
// 수정 버튼 누를시 입력된 값들 db.json에 보내기

const EditBtn = async () => {

  const editList = {
    title: title.value,
    date: selectedDate.value,
    userMoney: userMoney.value,
    type: categoryOn.value ? '지출' : '수입',
    category: selectedCategory.value,
    id: id.value,
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
    console.log('userId 값 가져오기', res);
    const currentUser = res.data;
    console.log('currentUser에 res.data넣기', currentUser);

    // map을 사용하여 해당 ID만 교체
    const updatedMoneyList = currentUser.moneyList.map(item => item.id === props.editData.id ? editList : item)

    // 3. 서버에 "이 유저의 moneyList만 이걸로 바꿔줘!"라고 PATCH 요청을 보냅니다.
    await axios.patch(`/api/users/${userId}`, {
      moneyList: updatedMoneyList,
    });
    // patch('위치', {K : V}) : 위치에 k 위치에 v값으로 바꿈

    console.log('수정 성공 0_<');
    await moneyStore.loadData();
    emit('close');
    alert("수정완료")
  } catch (err) {
    console.log('수정 실패 0_0....', err);
    alert("수정 실패")
  }
};
// ==============================================================
// 버튼 누르면 카테고리 바뀌기
const categoryOn = ref('');
const income = () => {
  categoryOn.value = false;
  console.log('수입');
};
const onCome = () => {
  categoryOn.value = true;
  console.log('지출');
};
// ============================================================


</script>

<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card shadow-lg">
      
      <div class="modal-header">
        <span class="header-title">거래 내역 수정</span>
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>

      <div class="amount-section">
        <input v-model="userMoney" type="number" class="amount-input" />
        <span class="currency">원</span>
      </div>

      <div class="type-tab-group">
        <button :class="['type-tab', { active: !categoryOn }]" @click="income">수입</button>
        <button :class="['type-tab', { active: categoryOn }]" @click="onCome">지출</button>
      </div>

      <div class="input-form-group">
        <div class="form-row">
          <label>카테고리</label>
          <select v-if="!categoryOn" v-model="selectedCategory" class="form-select">
            <option value="">수입 카테고리 선택</option>
            <option v-for="item in inCategories" :key="item">{{ item }}</option>
          </select>
          <select v-if="categoryOn" v-model="selectedCategory" class="form-select">
            <option value="">지출 카테고리 선택</option>
            <option v-for="item in outCategories" :key="item">{{ item }}</option>
          </select>
        </div>

        <div class="form-row">
          <label>거래명</label>
          <input v-model="title" class="form-input" placeholder="거래명 입력" />
        </div>

        <div class="form-row">
          <label>결제수단</label>
          <select v-model="accountInfo" class="form-select">
            <option value="">결제 수단 선택</option>
            <option v-for="item in account" :key="item.info" :value="`${item.bank}-${item.info}`">
              {{ item.bank }}-{{ item.info }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>날짜</label>
          <input type="date" v-model="selectedDate" class="form-input" />
        </div>

        <div class="form-row">
          <label>메모</label>
          <textarea v-model="memo" class="form-textarea" placeholder="메모 입력"></textarea>
        </div>
      </div>

      <button class="edit-footer-btn" @click="EditBtn">수정 완료</button>
    </div>
  </div>
</template>

<style scoped>
.modal-overlay {
  position: fixed; top: 0; left: 0; width: 100%; height: 100%;
  background: rgba(0, 0, 0, 0.5);
  display: flex; justify-content: center; align-items: center; z-index: 2000;
}

.modal-card {
  background: white; width: 450px; border-radius: 30px;
  padding: 25px; border: 2px solid #BFA5D4; position: relative;
}

.modal-header { display: flex; justify-content: space-between; align-items: center; margin-bottom: 15px; }
.header-title { color: #888; font-size: 14px; }
.close-btn { background: none; border: none; font-size: 20px; color: #BFA5D4; cursor: pointer; }

/* 금액 부분 */
.amount-section { display: flex; align-items: baseline; border-bottom: 2px solid #BFA5D4; margin-bottom: 20px; padding: 5px 0; }
.amount-input { border: none; font-size: 32px; font-weight: bold; width: 100%; outline: none; }
.currency { font-size: 24px; font-weight: bold; margin-left: 5px; }

/* 탭 */
.type-tab-group { display: flex; gap: 10px; margin-bottom: 25px; }
.type-tab { padding: 8px 20px; border-radius: 10px; border: none; background: #f5f5f5; color: #888; cursor: pointer; }
.type-tab.active { background: #FEF2FC; color: #7b4ca1; font-weight: bold; }

/* 폼 */
.input-form-group { display: flex; flex-direction: column; gap: 15px; margin-bottom: 30px; }
.form-row { display: flex; align-items: center; border-bottom: 1px solid #eee; padding: 8px 0; }
.form-row label { width: 80px; color: #888; font-size: 14px; }
.form-input, .form-select, .form-textarea { border: none; outline: none; flex: 1; font-size: 15px; font-weight: bold; }
.form-textarea { height: 60px; resize: none; }

/* 버튼 */
.edit-footer-btn {
  width: 100%; padding: 15px; border-radius: 15px; border: none;
  background: #BFA5D4; color: white; font-size: 16px; font-weight: bold; cursor: pointer;
}
.edit-footer-btn:hover { background: #7b4ca1; }
</style>