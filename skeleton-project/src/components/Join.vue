<template>
  <div>
    <header>header</header>
    <br />
    <div>
      <h1>회원가입</h1>
      <div>
        <label
          ><span>이름/닉네임</span
          ><input type="text" v-model.trim="userName" /></label
        ><br />
        <label
          ><span>아이디</span><input type="text" v-model.trim="userID" /></label
        ><span class="btn">중복확인</span><br />
        <div>{{ usedID === 1 ? '사용중인 아이디입니다.' : '' }}</div>
        <label
          ><span>비밀번호</span
          ><input type="password" v-model.trim="userPW" /></label
        ><br />
        <div>
          <p>
            {{
              userPW.length ? '영어/숫자 혼합하여 8자 이상 입력해주세요.' : ''
            }}
          </p>
        </div>
        <label
          ><span>비밀번호 확인</span
          ><input type="password" v-model.trim="userPWChecked" /></label
        ><br />
        <div>
          <p class="text-danger">
            {{
              userPW === userPWChecked ? '' : '비밀번호가 일치하지 않습니다.'
            }}
          </p>
        </div>
        <hr />
        <label
          ><span>은행</span
          ><select name="bank" id="bank" v-model="bank">
            <option value=""></option>
            <option
              v-for="bank in bankList"
              :value="bank"
            ></option></select></label
        ><br />
        <label
          ><span>계좌 이름/번호</span
          ><input type="text" v-model.trims="info" /></label
        ><br />
        <label
          ><span>계좌 잔액</span
          ><input type="text" v-model.number="balance" /></label
        ><br />
        <button>SUBMIT</button>
      </div>
    </div>
  </div>
</template>
<script setup>
import axios from 'axios';
import { ref } from 'vue';

// 입력받을 정보를 담을 변수 선언
const userName = ref('');
const userID = ref('');
const userPW = ref('');
const userPWChecked = ref('');
const bank = ref('');
const info = ref('');
const balance = ref(0);

// id 중복확인 로직
const usedID = ref(0);
const checkID = async () => {
  const resp = await axios.get('/api/users');
  const data = resp.data;
  for (let i = 0; i < data.length; i++) {
    if (data[i].userID === userID.value) {
      usedID.value = 1;
    }
  }
};
</script>
