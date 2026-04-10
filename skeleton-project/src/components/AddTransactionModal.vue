<script setup>
import { ref, onMounted } from 'vue';
import axios from 'axios';

const inCategories = ref({ 'income-category': [] });
const outCategories = ref({ 'outcome-category': [] });
const bankCategories = ref({ 'bank-category': [] });
onMounted(async () => {
  // 카테고리 정보를 서버에서 가져옴

  const res = await axios.get('/api/income-category');
  const res2 = await axios.get('/api/outcome-category');
  const res3 = await axios.get('/api/bank-category');
  inCategories.value = res.data;
  outCategories.value = res2.data;
  bankCategories.value = res3.data;

  console.log('수입데이터 받아오기', inCategories);
  console.log('지출데이터 받아오기', outCategories);
  console.log('결제수단 데이터 받아오기', outCategories);
});

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
      <select v-if="!categoryOn">
        <option value="">수입 카테고리를 선택하세요</option>
        <option v-for="item in inCategories" :key="item">{{ item }}</option>
      </select>
      <select v-if="categoryOn">
        <option value="">지출 카테고리를 선택하세요</option>
        <option v-for="item in outCategories" :key="item">{{ item }}</option>
      </select>

      <div>거래명</div>
      <input placeholder="거래명" />

      <div>결제수단</div>
      <select>
        <option value="">은행 카테고리를 선택하세요</option>
        <option v-for="item in bankCategories" :key="item">{{ item }}</option>
      </select>

      <div>날짜</div>
      <input type="date" />

      <div>메모</div>
      <textarea name="" id=""></textarea>

      <button @click="saveBtn">저장</button>
      <button>닫기</button>
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
