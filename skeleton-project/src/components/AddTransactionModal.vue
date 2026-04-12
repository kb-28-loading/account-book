<script setup>
import { ref, onMounted } from "vue";
import axios from "axios";
import { useLoginStore } from "@/stores/login";
import { useMoneyStore } from "@/stores/money";

const moneyStore = useMoneyStore();
const loginStore = useLoginStore();
const emit = defineEmits(["post", "close"]);
// ====================================================
// 카테고리 별 정보담기

const inCategories = ref({ "income-category": [] });
const outCategories = ref({ "outcome-category": [] });
const account = ref([]);
// ===============================================
// 초기 로딩 시 서버에서 데이터 가져오기
onMounted(async () => {
  const income = await axios.get("/api/income-category");
  const outcome = await axios.get("/api/outcome-category");
  const res = await axios.get(`/api/users/${loginStore.user.id}`);
  inCategories.value = income.data;
  outCategories.value = outcome.data;
  account.value = res.data.account;

  console.log("수입데이터 받아오기", inCategories);
  console.log("지출데이터 받아오기", outCategories);
  console.log("결제수단 데이터 받아오기", account);
});

// =======================================================
// 입력되는 값 받아서 db.json에 보내기

// 1. 각각의 입력값을 담을 바구니(ref) 선언
const title = ref("");
// placeholder="0"이 실제로 보이도록 초기값을 빈 문자열로 설정 (0으로 하면 placeholder가 아닌 실제 값으로 표시됨)
const userMoney = ref("");
const selectedCategory = ref("");
const memo = ref("");
const accountInfo = ref("");
const id = ref(0);

// =======================================================
const today = new Date();
const yyyy = today.getFullYear();
const mm = String(today.getMonth() + 1).padStart(2, "0");
const dd = String(today.getDate()).padStart(2, "0");
const selectedDate = ref(`${yyyy}-${mm}-${dd}`); // 기본값 설정
// + 버튼 눌렀을 때 당일의 날짜 불러오기
// =======================================================
// 저장 기능

const saveBtn = async () => {
  const newList = {
    title: title.value,
    date: selectedDate.value,
    userMoney: Number(userMoney.value), // 문자열로 입력된 값을 숫자로 변환해서 저장
    type: categoryOn.value ? "지출" : "수입",
    category: selectedCategory.value,
    id: Date.now(),
    memo: memo.value,
    accountInfo: accountInfo.value,
  };

  // 유효성 검사
  if (!userMoney.value) {
    alert("금액을 입력해주세요");
    return;
  }
  if (!selectedCategory.value) {
    alert("카테고리를 입력해주세요");
    return;
  }
  if (!title.value) {
    alert("거래명을 입력해주세요");
    return;
  }
  if (!accountInfo.value) {
    alert("결제수단을 선택해주세요");
    return;
  }

  // 1. 현재 로그인한 유저의 기존 정보를 먼저 가져옴
  const userId = loginStore.user.id;

  try {
    const res = await axios.get(`/api/users/${userId}`);
    const currentUser = res.data;
    console.log("userId 값 가져오기", res);
    console.log("currentUser에 res.data넣기", currentUser);

    // 2. 기존의 moneyList 배열에 새로운 항목(newList)을 추가
    const updatedMoneyList = [...currentUser.moneyList, newList];

    // 3. 서버에 로그인한 유저의 moneyList에만 PATCH 요청을 보냅니다.
    await axios.patch(`/api/users/${userId}`, {
      moneyList: updatedMoneyList,
    });

    console.log("저장 성공 0_<");
    await moneyStore.loadData();
    emit("close");
    alert("저장완료");
  } catch (err) {
    console.log("저장 실패 0_0....", err);
    alert("저장실패");
  }
};
// ==============================================================
// 수입 / 지출 탭 전환 
const categoryOn = ref("");
const income = () => {
  categoryOn.value = false;
  console.log("수입");
};
const onCome = () => {
  categoryOn.value = true;
  console.log("지출");
};
</script>
<template>
  <div class="modal-overlay" @click.self="$emit('close')">
    <div class="modal-card shadow-lg">
      <div class="modal-header">
        <span class="header-title">{{ title || "거래명" }}</span>
        <button class="close-btn" @click="$emit('close')">X</button>
      </div>

      <div class="amount-section">
        <!-- v-model 대신 :value + @input 사용 -->
        <!-- @input: 숫자 외 문자([^0-9]) 입력 시 즉시 제거 -->
        <!-- inputmode="numeric": 모바일에서 숫자 키패드 표시 -->
        <input
          :value="userMoney"
          @input="(e) => (userMoney = e.target.value.replace(/[^0-9]/g, ''))"
          type="text"
          class="amount-input"
          placeholder="0"
          inputmode="numeric"
        />
        <span class="currency">원</span>
      </div>

      <div class="type-tab-group">
        <button :class="['type-tab', { active: !categoryOn }]" @click="income">
          수입
        </button>
        <button :class="['type-tab', { active: categoryOn }]" @click="onCome">
          지출
        </button>
      </div>

      <div class="input-form-group">
        <div class="form-row">
          <label>카테고리</label>
          <select
            v-if="!categoryOn"
            v-model="selectedCategory"
            class="form-select"
          >
            <option value="">수입 카테고리 선택</option>
            <option v-for="item in inCategories['income-category']" :key="item">{{ item }}</option>
          </select>
          <select
            v-if="categoryOn"
            v-model="selectedCategory"
            class="form-select"
          >
            <option value="">지출 카테고리 선택</option>
            <option v-for="item in outCategories['income-category']" :key="item">
              {{ item }}
            </option>
          </select>
        </div>

        <div class="form-row">
          <label>거래명</label>
          <input
            :value="title"
            @input="title = $event.target.value"
            class="form-input"
            placeholder="거래명을 입력하세요"
          />
        </div>

        <div class="form-row">
          <label>결제수단</label>
          <select v-model="accountInfo" class="form-select">
            <option value="">은행 카테고리 선택</option>
            <option
              v-for="item in account"
              :key="item.info"
              :value="`${item.bank}-${item.info}`"
            >
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
          <textarea
            v-model="memo"
            class="form-textarea"
            placeholder="메모를 입력하세요"
          ></textarea>
        </div>
      </div>

      <button class="save-footer-btn" @click="saveBtn">저장</button>
    </div>
  </div>
</template>

<style scoped>
/* 배경 어두워지는 효과 고정 */
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
  z-index: 2000;
}

/* 2번 사진 스타일의 화이트 카드 */
.modal-card {
  background: white;
  width: 450px;
  border-radius: 30px;
  overflow: hidden;
  position: relative;
  padding: 25px;
  border: 2px solid #bfa5d4;
}

.modal-header {
  display: flex;
  justify-content: space-between;
  align-items: center;
  margin-bottom: 15px;
}
.header-title {
  color: #888;
  font-size: 14px;
}
.close-btn {
  background: none;
  border: none;
  font-size: 20px;
  color: #bfa5d4;
  cursor: pointer;
}

/* 금액 입력 부분 강조 */
.amount-section {
  display: flex;
  align-items: baseline;
  border-bottom: 2px solid #bfa5d4;
  margin-bottom: 20px;
  padding: 5px 0;
}
.amount-input {
  border: none;
  font-size: 32px;
  font-weight: bold;
  width: 100%;
  text-align: left;
  outline: none;
}
.currency {
  font-size: 24px;
  font-weight: bold;
  margin-left: 5px;
}

/* 탭 버튼 스타일 */
.type-tab-group {
  display: flex;
  gap: 10px;
  margin-bottom: 25px;
}
.type-tab {
  padding: 8px 20px;
  border-radius: 10px;
  border: none;
  background: #f5f5f5;
  color: #888;
  font-weight: bold;
  cursor: pointer;
}
.type-tab.active {
  background: #fef2fc;
  color: #7b4ca1;
}

/* 입력 폼 그리드 스타일 */
.input-form-group {
  display: flex;
  flex-direction: column;
  gap: 15px;
  margin-bottom: 30px;
}
.form-row {
  display: flex;
  align-items: center;
  border-bottom: 1px solid #eee;
  padding: 8px 0;
}
.form-row label {
  width: 80px;
  color: #888;
  font-size: 14px;
  font-weight: 500;
}
.form-input,
.form-select,
.form-textarea {
  border: none;
  outline: none;
  flex: 1;
  font-size: 15px;
  font-weight: bold;
  background: none;
}
.form-textarea {
  height: 60px;
  resize: none;
}

/* 하단 저장 버튼 */
.save-footer-btn {
  width: 100%;
  padding: 15px;
  border-radius: 15px;
  border: none;
  background: #fef2fc;
  color: #7b4ca1;
  font-size: 16px;
  font-weight: bold;
  cursor: pointer;
  transition: 0.2s;
}
.save-footer-btn:hover {
  background: #bfa5d4;
  color: white;
}
</style>
