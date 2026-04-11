<template>
  <div style="padding: 24px">
    <div>
      <!-- 페이지 제목 -->
      <div style="font-size: 28px; font-weight: 700; margin-bottom: 20px">
        예산관리 <span>예산설정</span>
      </div>

      <!-- 제목 아래 보라색 선 -->
      <hr class="title-underline" />

      <div>
        <!-- 월 이동 영역 -->
        <div style="font-size: 24px; font-weight: 600; margin-bottom: 16px">
          <span @click="prevMonth" style="cursor: pointer">←</span>
          <span style="margin: 0 12px">{{ month }}월</span>
          <span @click="nextMonth" style="cursor: pointer">→</span>
        </div>

        <!-- 전체 예산 합계 표시 -->
        <div style="font-size: 22px; font-weight: 700; margin-bottom: 24px">
          전체예산 : {{ totalBudget.toLocaleString() }}
        </div>

        <!-- 카테고리 입력칸들을 2열 그리드로 배치 -->
        <div
          style="
            display: grid;
            grid-template-columns: 1fr 1fr;
            column-gap: 48px;
            row-gap: 20px;
            max-width: 900px;
          "
        >
          <!-- categories 배열을 반복해서 각 항목 입력칸 생성 -->
          <div
            v-for="item in categories"
            :key="item.key"
            style="display: flex; align-items: center; gap: 12px"
          >
            <!-- 카테고리 이름 -->
            <div
              style="
                width: 120px;
                text-align: right;
                font-size: 18px;
                font-weight: 600;
                flex-shrink: 0;
              "
            >
              {{ item.label }} :
            </div>

            <!-- 각 카테고리 예산 입력칸 -->
            <!-- v-model.number: 입력값을 숫자로 budget 객체에 저장 -->
            <input
              type="number"
              v-model.number="budget[item.key]"
              style="
                width: 220px;
                height: 40px;
                padding: 0 12px;
                font-size: 18px;
                box-sizing: border-box;
              "
            />
          </div>
        </div>
      </div>
    </div>

    <!-- 설정완료 버튼 -->
    <div
      style="
        margin-top: 48px;
        width: 900px;
        display: flex;
        justify-content: flex-end;
      "
    >
      <button
        @click="setting"
        style="
          padding: 10px 18px;
          font-size: 18px;
          font-weight: 600;
          cursor: pointer;
        "
      >
        설정완료
      </button>
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from "vue";

// 현재 선택된 월
const month = ref(1);

// 현재 선택된 사용자
const selectedUser = ref("신송윤");

// 사용자별, 월별 예산 데이터
const userBudgetData = {
  신송윤: {
    1: { food: 250000, culture: 150000, transport: 100000 },
    2: { food: 300000, shopping: 200000 },
    3: { food: 250000, culture: 200000, shopping: 150000 },
  },
  한혜지: {
    1: { food: 300000, transport: 100000, culture: 200000 },
    2: { food: 350000, shopping: 200000, transport: 100000 },
    3: { food: 300000, shopping: 200000, culture: 300000 },
  },
  장진서: {
    1: { food: 200000, culture: 150000 },
    2: { food: 250000, transport: 100000 },
    3: { food: 200000, shopping: 100000, culture: 200000 },
  },
};

// 화면에 보여줄 카테고리 목록
const categories = [
  { key: "food", label: "식비" },
  { key: "housing", label: "주거/통신" },
  { key: "life", label: "생활" },
  { key: "shopping", label: "온라인쇼핑" },
  { key: "cafe", label: "카페/간식" },
  { key: "transport", label: "교통" },
  { key: "culture", label: "문화/여가" },
];

// 기본 예산값
// 어떤 카테고리 값이 없어도 일단 0으로 채워 넣기 위해 사용
const defaultBudget = {
  food: 0,
  housing: 0,
  life: 0,
  shopping: 0,
  cafe: 0,
  transport: 0,
  culture: 0,
};

// 실제 입력되고 수정되는 예산 객체
const budget = ref({ ...defaultBudget });

// 전체 예산 합계
const totalBudget = ref(0);

// 각 카테고리 값을 모두 더해서 전체예산 계산
const calculateTotal = () => {
  totalBudget.value =
    (budget.value.food || 0) +
    (budget.value.housing || 0) +
    (budget.value.life || 0) +
    (budget.value.shopping || 0) +
    (budget.value.cafe || 0) +
    (budget.value.transport || 0) +
    (budget.value.culture || 0);
};

// month나 selectedUser가 바뀌면
// 해당 사용자, 해당 월의 예산 데이터를 불러와서 budget에 넣음
watch(
  [month, selectedUser],
  () => {
    const userData = userBudgetData[selectedUser.value];
    const monthData = userData?.[month.value];

    budget.value = {
      ...defaultBudget,
      ...monthData,
    };

    calculateTotal();
  },
  { immediate: true }, // 페이지가 처음 열릴 때도 바로 실행
);

// 입력칸 값이 바뀔 때마다 전체예산 다시 계산
watch(
  budget,
  () => {
    calculateTotal();
  },
  { deep: true }, // budget 객체 내부 값 변화까지 감지
);

// 이전 달로 이동
const prevMonth = () => {
  if (month.value > 1) month.value--;
};

// 다음 달로 이동
const nextMonth = () => {
  if (month.value < 12) month.value++;
};

// 설정완료 버튼 클릭 시 현재 값 확인용
const setting = () => {
  console.log("현재 유저:", selectedUser.value);
  console.log("현재 월:", month.value);
  console.log("예산:", budget.value);
};
</script>
