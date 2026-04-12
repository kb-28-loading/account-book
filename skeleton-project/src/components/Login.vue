<template>
  <div class="login-page">
    <div class="logo-box">
      <img src="@/assets/mainLogo.jpg" alt="메인로고" />
    </div>
    <div class="login-box">
      <h1 class="login-title">LOGIN</h1>
      <div class="login-form">
        <div @keyup.enter="login(ID, PW)">
          <input
            class="login-input"
            type="text"
            placeholder="id"
            v-model="ID"
          />
          <input
            class="login-input"
            type="password"
            placeholder="pw"
            v-model="PW"
          />
          <div class="error-msg" v-if="loginStore.undeID === 1">
            회원정보가 존재하지 않습니다.
          </div>
          <div class="error-msg" v-if="loginStore.undePW === 1">
            비밀번호가 일치하지 않습니다.
          </div>
          <button class="login-btn" @click.stop="login(ID, PW)">LOGIN</button>
        </div>
        <div class="go-join" @click.stop="goJoin">회원가입 하기</div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useLoginStore } from '@/stores/login';

const ID = ref('');
const PW = ref('');

const loginStore = useLoginStore();

const emit = defineEmits(['login-success', 'go-join']);

const login = async (ID, PW) => {
  console.log('로그인 이벤트 실행');

  const resp = await loginStore.login(ID, PW);
  if (resp === 'success') {
    console.log('로그인 정보는 넘어옴');
    emit('login-success');
  }
};

const goJoin = () => {
  emit('go-join');
};
</script>

<style scoped>
.login-page {
  display: flex;
  justify-content: center;
  align-items: center;
  gap: 60px;
  min-height: 100vh;
  background-color: #f8f4fe;
}

.logo-box {
  /* background-color: #ffffff;
  border-radius: 30px;
  padding: 30px; */
  display: flex;
  align-items: center;
  justify-content: center;
  /* box-shadow: 0 2px 10px rgba(0, 0, 0, 0.05); */

  width: 542px;
  height: 360px;
  overflow: hidden;
  border-radius: 16px;
}

.logo-box img {
  width: 750px;
}

.login-box {
  background-color: #ffffff;
  border: 2px solid #c9a8e0;
  border-radius: 24px;
  padding: 40px 50px;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 20px;
  min-width: 340px;
}

.login-title {
  color: #7b3fa0;
  font-size: 2rem;
  font-weight: bold;
  margin: 0 0 10px 0;
}

.login-form {
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 14px;
  width: 100%;
}

.login-input {
  width: 100%;
  padding: 12px 16px;
  border: 1.5px solid #c9a8e0;
  border-radius: 10px;
  font-size: 1rem;
  color: #333;
  outline: none;
  box-sizing: border-box;
  margin-bottom: 10px;
  background-color: #fff;
}

.login-input::placeholder {
  color: #aaa;
}

.login-input:focus {
  border-color: #9b59b6;
}

.login-btn {
  width: 100%;
  padding: 12px;
  background-color: #b08ec0;
  color: #ffffff;
  font-size: 1rem;
  font-weight: bold;
  border: none;
  border-radius: 10px;
  cursor: pointer;
  letter-spacing: 2px;
  transition: background-color 0.2s;
}

.login-btn:hover {
  background-color: #9b70b5;
}

.go-join {
  margin-top: 8px;
  font-size: 0.85rem;
  color: #888;
  cursor: pointer;
  text-decoration: underline;
}

.go-join:hover {
  color: #7b3fa0;
}

.error-msg {
  color: #e74c3c;
  font-size: 0.85rem;
  margin-bottom: 6px;
}
</style>
