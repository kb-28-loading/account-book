<template>
  <div>
    <h1>로그인 화면</h1>
    <div>로고 이미지</div>
    <div>
      <h1>LOGIN</h1>
      <div>
        <input type="text" placeholder="ID" v-model="ID" /> <br />
        <input type="password" placeholder="PW" v-model="PW" /> <br />
        <div class="text-danger" v-if="loginStore.undeID === 1">
          회원정보가 존재하지 않습니다.
        </div>
        <div class="text-danger" v-if="loginStore.undePW === 1">
          비밀번호가 일치하지 않습니다.
        </div>
        <button @click="login(ID, PW)">Login</button>
        <p>회원가입 하기</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/login';
import { useRouter } from 'vue-router';

// 사용자가 로그인 시 입력한 정보를 받을 변수 선언
const ID = ref('');
const PW = ref('');

// 로그인 한 User 정보 스토어에 저장
const loginStore = useLoginStore();

// 로그인 완료 시 Home.vue로 이동하기 위한 함수 설정
// 회원정보 확인 시 loginStore에서 호출
const emit = defineEmits(['login-success']);

const login = async (ID, PW) => {
  const resp = await loginStore.login(ID, PW);
  if (resp === 'success') {
    console.log('로그인 정보는 넘어옴');

    emit('login-success');
  }
};
</script>
