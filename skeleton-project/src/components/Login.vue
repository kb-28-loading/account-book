<template>
  <div>
    <h1>로그인 화면</h1>
    <div>로고 이미지</div>
    <div>
      <h1>LOGIN</h1>
      <div>
        <input type="text" placeholder="ID" v-model="ID" /> <br />
        <input type="password" placeholder="PW" v-model="PW" /> <br />
        <button @click="loginStore.login(ID, PW)">Login</button>
        <p>회원가입 하기</p>
      </div>
    </div>
  </div>
</template>
<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/login';

// 사용자가 로그인 시 입력한 정보를 받을 변수 선언
const ID = ref('');
const PW = ref('');

// 로그인 한 User 정보 스토어에 저장
const loginStore = useLoginStore();
</script>
