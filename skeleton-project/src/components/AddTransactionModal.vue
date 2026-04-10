<script setup>
import { ref } from 'vue';
import axios from 'axios';

// 부모(메인화면)로부터 '닫기' 함수와 '유저정보' 등을 받음
const props = defineProps(['userId']);
const emit = defineEmits(['close', 'refresh']);

const title = ref('');
const amount = ref(0);

const addData = async () => {
  const newItem = {
    title: title.value,
    amount: amount.value,
    userId: props.userId,
    date: '2026-04-10',
  };
  await axios.post('/api/moneyList', newItem);
  emit('refresh'); // 데이터 새로고침하라고 부모에게 신호 보냄
  emit('close'); // 팝업 닫으라고 부모에게 신호 보냄
};
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
      <h3>거래명과 연동</h3>

      <input type="number" placeholder="금액" />

      <span>
        <button @click="income">수입</button
        ><button @click="onCome">지출</button>
      </span>

      <div>카테고리</div>
      <select>
        <option value="">카테고리를 선택하세요</option>
        <option value="meal">식비</option>
        <option value="transport">교통비</option>
        <option value="mart">생필품</option>
      </select>

      <div>거래명</div>
      <input v-model="title" placeholder="거래명" />

      <div>결제수단</div>
      <select>
        <option value="" disabled>카테고리를 선택하세요</option>
        <option value="meal">식비</option>
        <option value="transport">교통비</option>
        <option value="mart">생필품</option>
      </select>

      <div>날짜</div>
      <input type="date" />

      <div>메모</div>
      <textarea name="" id=""></textarea>

      <button @click="addData">저장</button>
      <button @click="$emit('close')">닫기</button>
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
