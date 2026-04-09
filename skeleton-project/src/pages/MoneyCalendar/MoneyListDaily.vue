<template>
  <div>해당 날짜에 해당하는 거래내역</div>
  <table class="table">
    <thead>
      <tr>
        <th>거래명</th>
        <th>카테고리</th>
        <th>금액</th>
      </tr>
    </thead>
    <tbody>
      <tr v-for="value in dailyList" :key="value.listId">
        <td>{{ value.title }}</td>
        <td>{{ value.category }}</td>
        <td>{{ value.date }}</td>
      </tr>
    </tbody>
  </table>
</template>
<script setup>
import { ref, watch, onMounted } from 'vue';
import { useLoginStore } from '@/stores/login';
import { useRoute, useRouter } from 'vue-router';
import axios from 'axios';

const currentRoute = useRoute();

// 저장되어있는 사용자의 거래내역 중 해당 날짜인 객체 추출 후 배열로 저장
const loginStore = useLoginStore();

// 주소가 바뀔때 마다 감시해서 데이터를 새로 필터링함
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
// ref로 해야 실시간으로 바뀜

// 같은 날에 있는 값들 챙기기
const getFilteredList = async (date) => {
  const resp = await axios.get(`/api/users/${loginStore.user.id}`);
  dailyList.value = resp.data.moneyList.filter((item) => item.date === date);
  // .filter((item) => item.date === date) : 배열 안에서 같은 것을 골라냄
};

// onMounted(()=>{...}) : 사용자가 페이지에 접속하자마자 실행되는 것
// 사용 이유 -> 처음 홈으로 들어온다면 '이전 값'이 존재하지않기 때문에 사
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
</script>
