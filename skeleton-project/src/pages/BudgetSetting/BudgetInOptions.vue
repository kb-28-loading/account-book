<template>
  <div class="options-main-container">
    <div>
      <!-- 수정사항 - 전체예산 입력받아 작성 -->
      전체예산 :
      <input
        type="number"
        v-model.number="savedTotalAmount"
        placeholder="총 예산을 입력하세요"
      />
      원
    </div>

    <hr class="title-underline" />

    <div>
      <div v-for="catName in allCategories" :key="catName">
        <div>{{ catName }} :</div>
        <input type="number" v-model.number="budgetInputs[catName]" />
      </div>
    </div>

    <div>
      <button @click="saveBudget">설정완료</button>
    </div>

    <div v-if="currentTotalDisplay > 0" style="margin-top: 10px; color: gray">
      현재 카테고리 합계: {{ currentTotalDisplay.toLocaleString() }}원
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from "vue";
import axios from "axios";
import { useLoginStore } from "@/stores/login";

const loginStore = useLoginStore();
const allCategories = ref([]);
const budgetInputs = ref({});

// (수정 사항)전역 변수들
const budgetCategory = ref({});
const currentTotal = ref(0);
const savedTotalAmount = ref(0); // 사용자가 직접 입력하는 '목표 예산'

// 현재 입력된 카테고리들의 합계를 실시간으로 계산해주는 computed (조건 검사용)
const currentTotalDisplay = computed(() => {
  return Object.values(budgetInputs.value).reduce(
    (acc, cur) => acc + (Number(cur) || 0),
    0,
  );
});

// 데이터 불러오기 로직
const fetchData = async () => {
  if (!loginStore.user?.id) return;

  try {
    const catResp = await axios.get("http://localhost:3000/outcome-category");
    allCategories.value = catResp.data;

    const userResp = await axios.get(
      `http://localhost:3000/users/${loginStore.user.id}`,
    );
    const userData = userResp.data;

    if (userData.userBudget && userData.userBudget.length > 0) {
      const latestData = userData.userBudget[userData.userBudget.length - 1];

      // 서버에서 저장된 전체 예산과 카테고리별 데이터를 불러옴
      savedTotalAmount.value = latestData.budgetTot || 0;
      budgetCategory.value = latestData.budgetCategory || {};

      allCategories.value.forEach((catName) => {
        budgetInputs.value[catName] = latestData.budgetCategory[catName] || 0;
      });
    }
  } catch (err) {
    console.error("데이터 로드 실패", err);
  }
};

// 버튼 클릭 시 실행되는 함수
const saveBudget = () => {
  // 1. 초기화
  budgetCategory.value = {};
  let tempTotal = 0;

  // 2. 카테고리별 합계 계산
  allCategories.value.forEach((catName) => {
    const val = budgetInputs.value[catName];
    if (val && val !== 0) {
      budgetCategory.value[catName] = val;
      tempTotal += val;
    }
  });

  // 3. 조건 검사: 카테고리 합계가 입력한 전체 예산을 초과하는지 확인 (수정사항)
  if (tempTotal > savedTotalAmount.value) {
    alert(`카테고리 예산 합계(${tempTotal.toLocaleString()}원)가 
전체 예산(${savedTotalAmount.value.toLocaleString()}원)을 초과합니다!
금액을 다시 확인해주세요.`);
    return; // 저장하지 않고 함수 종료
  }

  // 4. 조건을 통과하면 전역 변수에 최종 합계 저장
  currentTotal.value = tempTotal;

  // 최종 객체 로그
  console.log("저장 성공.데이터(객체):", {
    userId: loginStore.user.id,
    budgetCategory: budgetCategory.value,
    budgetTot: savedTotalAmount.value, // 전체 예산 기준
    calculatedTot: currentTotal.value, // 실제 카테고리 합계
  });

  alert("예산 설정이 완료되었습니다.");
};

onMounted(fetchData);

console.log("세팅 완료");
</script>
