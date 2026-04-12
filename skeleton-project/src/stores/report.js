import { defineStore } from "pinia";
import { useLoginStore } from "@/stores/login";
import { ref, computed } from "vue";
import axios from "axios";
import { useMoneyStore } from "./money";

export const useReportStore = defineStore("report", () => {
  // 로그인 한 사용자의 거래내역 정보를 받아오기
  const loginStore = useLoginStore();
  const moneyStore = useMoneyStore();
  const moneyList = ref([]);

  // 카테고리 별 금액 합산
  const usedCategoryOutcome = ref([]); // 지출 카테고리만 저장
  const categoryOutcomeMoney = ref({}); // 지출 각 카테고리 별 지출 금액 총합
  const sortedOutcomeMoney = ref([]); // 카테고리 배열과 순서맞춰 금액 정렬
  const totOutcome = ref(0); // 총 지출금액
  const usedCategoryIncome = ref([]); // 수입 카테고리만 저장
  const categoryIncomeMoney = ref({}); // 수입 각 카테고리 별 수입 금액 총합
  const sortedIncomeMoney = ref([]); // 카테고리 배열 순서 맞춰 금액 정렬
  const totIncome = ref(0); // 총 수입 금액

  const date = new Date();
  const month = ref(date.getMonth() + 1);
  const year = ref(date.getFullYear());

  const userData = computed(async () => {
    month.value;
    year.value;
    moneyStore.reloading;
    const resp = await axios.get(`/api/users/${loginStore.user.id}`);
    moneyList.value = resp.data.moneyList;
    console.log("reportStore userData 함수 실행");
    // 함수 실행 전 내부 변수 초기화
    // 수입 관련
    usedCategoryIncome.value = [];
    categoryIncomeMoney.value = {};
    sortedIncomeMoney.value = [];
    totIncome.value = 0;

    // 지출 관련
    usedCategoryOutcome.value = [];
    categoryOutcomeMoney.value = {};
    sortedOutcomeMoney.value = [];
    totOutcome.value = 0;

    // 거래내역을 받아온 후 함수 호출
    reportDate(month, year, moneyStore.reloading);
    categoryCalc(month, year, moneyStore.reloading);
    // 객체에 담긴 소비 총 금액을 퍼센트로 계산
    calcPercent(categoryIncomeMoney, totIncome, month, year);
    calcPercent(categoryOutcomeMoney, totOutcome, month, year);
    // 배열에 담긴 카테고리 순서대로 금액 퍼센트를 정렬
    sortingMoney(
      usedCategoryIncome,
      categoryIncomeMoney,
      sortedIncomeMoney,
      month,
      year,
    );
    sortingMoney(
      usedCategoryOutcome,
      categoryOutcomeMoney,
      sortedOutcomeMoney,
      month,
      year,
    );
  });

  // 정해진 달에 해당하는 거래내역을 필터링
  const moneyListFiltered = ref([]);
  const reportDate = (month, year) => {
    let settingDate = "";
    // 필터링 거래내역 초기화
    moneyListFiltered.value = [];
    // 1-9월 앞에 0 붙이기
    if (month.value.toString().length < 2) {
      settingDate = `${year.value}-0${month.value}`;
    } else {
      settingDate = `${year.value}-${month.value}`;
    }

    // moneyList내 정해진 달의 거래내역 저장
    for (let i = 0; i < moneyList.value.length; i++) {
      if (moneyList.value[i].date.indexOf(settingDate) !== -1) {
        moneyListFiltered.value.push(moneyList.value[i]);
      }
    }
    console.log("settingDate", settingDate);
  };

  const categoryCalc = () => {
    // 함수 실행 전 내부 변수 초기화
    // 수입 관련
    usedCategoryIncome.value = [];
    categoryIncomeMoney.value = {};
    totIncome.value = 0;
    // 지출 관련
    usedCategoryOutcome.value = [];
    categoryOutcomeMoney.value = {};
    totOutcome.value = 0;

    // 수입 데이터와 지출 데이터를 구분지어서 이용된 카테고리를 각각 저장
    for (let i = 0; i < moneyListFiltered.value.length; i++) {
      if (moneyListFiltered.value[i].type === "수입") {
        totIncome.value += moneyListFiltered.value[i].userMoney;
        if (
          usedCategoryIncome.value.filter(
            (c) => c === moneyListFiltered.value[i].category,
          ).length === 0
        ) {
          usedCategoryIncome.value.push(moneyListFiltered.value[i].category);
          const category = moneyListFiltered.value[i].category;
          const money = moneyListFiltered.value[i].userMoney;
          categoryIncomeMoney.value[category] = money;
        } else {
          const category = moneyListFiltered.value[i].category;
          const money = moneyListFiltered.value[i].userMoney;
          categoryIncomeMoney.value[category] += money;
        }
      }
      if (moneyListFiltered.value[i].type === "지출") {
        totOutcome.value += moneyListFiltered.value[i].userMoney;
        if (
          usedCategoryOutcome.value.filter(
            (c) => c === moneyListFiltered.value[i].category,
          ).length === 0
        ) {
          usedCategoryOutcome.value.push(moneyListFiltered.value[i].category);
          const category = moneyListFiltered.value[i].category;
          const money = moneyListFiltered.value[i].userMoney;
          categoryOutcomeMoney.value[category] = money;
        } else {
          const category = moneyListFiltered.value[i].category;
          const money = moneyListFiltered.value[i].userMoney;
          categoryOutcomeMoney.value[category] += money;
        }
      }
    }
    console.log("category 입력받기");
  };

  // 각 카테고리 별 합산 금액을 전체 금액의 퍼센트로 변환
  const calcPercent = (obj, tot) => {
    for (let key in obj.value) {
      obj.value[key] = (obj.value[key] / tot.value) * 100;
    }
    console.log("퍼센트 계산");
  };

  // 카테고리 배열과 금액의 순서를 맞춰주는 함수
  const sortingMoney = (arr, obj, result) => {
    // console.log(arr.value);

    // 초기 결과배열 초기화
    result.value = [];

    for (let i = 0; i < arr.value.length; i++) {
      result.value.push(obj.value[arr.value[i]]);
    }
    console.log("배열정렬", result.value);
  };

  return {
    userData,
    usedCategoryIncome,
    usedCategoryOutcome,
    sortedIncomeMoney,
    sortedOutcomeMoney,
    totOutcome,
    month,
    year,
  };
});
