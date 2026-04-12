<template>
  <div class="outer">
    <Header />
    <br />
    <div class="main-monitor">
      <h1>회원가입</h1>
      <div class="options-main-container join-main-monitor">
        <label
          ><div>이름/닉네임</div>
          <input type="text" v-model.trim="userName"
        /></label>
        <div>
          <label
            ><div>아이디</div>
            <input type="text" v-model.trim="userID"
          /></label>
          <div class="btn" @click="checkID">중복확인</div>
          <div class="text-danger fs-6">
            {{ usedID === 1 ? "사용중인 아이디입니다." : "" }}
          </div>
        </div>

        <label
          ><div>비밀번호</div>
          <input type="password" v-model.trim="userPW"
        /></label>
        <div>
          <p>
            {{ userPW.length < 8 ? "8자 이상 입력해주세요." : "" }}
          </p>
        </div>
        <div>
          <label
            ><div>비밀번호 확인</div>
            <input type="password" v-model.trim="userPWChecked"
          /></label>
          <div>
            <p class="text-danger">
              {{
                userPW === userPWChecked && userPWChecked !== ""
                  ? ""
                  : "비밀번호가 일치하지 않습니다."
              }}
            </p>
          </div>
        </div>

        <hr />
        <label
          ><div>은행</div>
          <select name="bank" id="bank" v-model="bank">
            <option value="">은행</option>
            <option v-for="bank in bankList" :value="bank">{{ bank }}</option>
          </select></label
        >
        <label
          ><div>계좌 이름/번호</div>
          <input type="text" v-model.trims="info"
        /></label>
        <label
          ><div>계좌 잔액</div>
          <input type="text" v-model.number="balance" /></label
        ><br />
        <div><button @click="checkFullForm">SUBMIT</button></div>
      </div>
    </div>
    <Footer />
  </div>
</template>
<script setup>
import axios from "axios";
import { ref } from "vue";
import Footer from "./Footer.vue";
import Header from "./Header.vue";

// 입력받을 정보를 담을 변수 선언
const userName = ref("");
const userID = ref("");
const userPW = ref("");
const userPWChecked = ref("");
const bankList = ref([]);
const bank = ref("");
const info = ref("");
const balance = ref(0);

// 은행 리스트를 서버에서 불러오기
const bankListCall = async () => {
  const resp = await axios.get("/api/bank-category");
  bankList.value = resp.data;
};
bankListCall();

// id 중복확인 로직
const usedID = ref(0);
const checkID = async () => {
  const resp = await axios.get("/api/users");
  const data = resp.data;
  for (let i = 0; i < data.length; i++) {
    if (data[i].userID === userID.value) {
      usedID.value = 1;
      userID.value = "";
      return;
    }
  }
  usedID.value = 2;
};

// 새로운 유저의 정보를 db.json에 넘기는 함수
// emit을 통해 App.vue에서 /login 화면으로 이동
const postNewUser = async () => {
  const newUser = {};
  newUser.userID = userID.value;
  newUser.userPW = userPW.value;
  newUser.userName = userName.value;
  newUser.account = [];
  const bank2 = bank.value;
  const info2 = info.value;
  const balance2 = balance.value;
  newUser.account.push({ bank: bank2, info: info2, balance: balance2 });
  newUser.moneyList = [];
  newUser.userBudget = [];
  // console.log(newUser);

  // 서버로 새로운 User에 대한 정보 진행
  const resp = await axios.post("/api/users", newUser);
  // console.log(resp.data);

  emit("new-user");
};

// 입력받은 값의 유효성을 검사한 뒤 새로운 유저의 정보를 db.json에 넘기는 함수 호출
const checkFullForm = () => {
  let checkedForm = 0;

  // 이름을 입력 여부 확인
  if (userName.value.length !== 0) {
    checkedForm = 1;

    // 아이디 입력 및 중복검사 여부 확인
    if (usedID.value === 2) {
      checkedForm = 2;
      console.log("이름도 있고 아이디 중복검사도 통과 했다");

      // 비밀번호 유효성 검사 확인
      if (
        userPW.value.replace(/[^a-zA-Z ]/g, "").length !== 0 &&
        userPW.value.replace(/[^0-9]/g, "").length !== 0 &&
        userPW.value.length >= 8
      ) {
        checkedForm = 3;
        console.log("비밀번호 유효성 검사 통과");

        // 비밀번호 확인 완료 여부 확인
        if (userPW.value === userPWChecked.value) {
          checkedForm = 4;
          console.log("비밀번호까지 확인 다 되었다");

          // 은행 선택 여부 확인
          if (bank.value.length !== 0) {
            checkedForm = 5;
            console.log("은행정보도 있어요");

            // 계좌 이름/번호 입력 여부 확인
            if (info.value.length !== 0) {
              checkedForm = 6;
              console.log("계좌 이름까지 받았어요");

              // 계좌 잔액 입력 여부 확인
              if (balance.value !== 0) {
                checkedForm = 7;
                console.log("계좌 잔액까지 모두 입력 받았어요");
                postNewUser();
              } else {
                alert("계좌 잔액을 입력하세요");
                return;
              }
            } else {
              alert("계좌 이름을 설정해주세요");
              return;
            }
          } else {
            alert("은행 정보를 선택해주세요");
            return;
          }
        } else {
          alert("비밀번호가 일치하지 않습니다.");
          return;
        }
      } else {
        console.log("영어", userPW.value.replace(/[^a-zA-Z ]/g, "").length);
        console.log("숫자", userPW.value.replace(/[^0-9]/g, "").length);

        alert("비밀번호를 다시 설정해주세요");
        return;
      }
    } else if (usedID.value === 1) {
      alert("중복된 아이디를 수정해주세요");
      return;
    } else {
      alert("아이디를 입력하세요");
      return;
    }
  }
  console.log(checkedForm);
};
</script>
<style scoped>
/* ── 메인 모니터 컨테이너 ── */
.main-monitor {
  margin: 50px 20px 0;
  padding: 40px 40px 0;
  background-color: white;
  border-radius: 60px 60px 0 0;
  border-top: 3px rgb(123, 76, 161) solid;
  border-left: 3px rgb(123, 76, 161) solid;
  border-right: 3px rgb(123, 76, 161) solid;
}

/* ── REGISTER 타이틀 ── */
.main-monitor > h1 {
  text-align: center;
  font-size: 2rem;
  font-weight: 900;
  color: #6b4fa0;
  letter-spacing: 4px;
  margin-bottom: 28px;
  text-transform: uppercase;
}

/* ── 폼 내부 컨테이너 ── */
.join-main-monitor {
  padding: 30px 80px 45px;
  display: flex;
  flex-direction: column;
  gap: 14px;
  text-align: left;
}

/* ── 공통 레이블 (label 태그) ── */
.join-main-monitor label {
  display: flex;
  align-items: center;
}

/* 레이블 텍스트 div */
.join-main-monitor label > div {
  width: 130px;
  min-width: 130px;
  text-align: right;
  padding-right: 18px;
  color: #999;
  font-size: 0.9rem;
}

/* ── 공통 인풋 ── */
.join-main-monitor input[type="text"],
.join-main-monitor input[type="password"] {
  flex: 1;
  padding: 10px 15px;
  border: 1.5px solid #c5aae0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  background: #fff;
  transition:
    border-color 0.2s,
    box-shadow 0.2s;
}

.join-main-monitor input:focus {
  border-color: #7b4ca1;
  box-shadow: 0 0 0 3px rgba(123, 76, 161, 0.12);
}

/* ── 은행 셀렉트 ── */
.join-main-monitor select {
  flex: 1;
  padding: 10px 40px 10px 15px;
  border: 1.5px solid #c5aae0;
  border-radius: 8px;
  font-size: 0.9rem;
  font-family: inherit;
  outline: none;
  background-color: #fff;
  background-image: url("data:image/svg+xml;charset=UTF-8,%3csvg xmlns='http://www.w3.org/2000/svg' viewBox='0 0 24 24'%3e%3cpath fill='%237b4ca1' d='M7 10l5 5 5-5z'/%3e%3c/svg%3e");
  background-repeat: no-repeat;
  background-position: right 10px center;
  background-size: 24px;
  appearance: none;
  -webkit-appearance: none;
  cursor: pointer;
  color: #555;
}

/* ── 아이디 행 (label + 중복확인 버튼 + 에러) ── */
.join-main-monitor > div:has(.btn) {
  display: flex;
  flex-wrap: wrap;
  align-items: center;
}

.join-main-monitor > div:has(.btn) > label {
  flex: 1;
}

.join-main-monitor > div:has(.btn) > .text-danger {
  width: 100%;
  padding-left: 148px;
  font-size: 0.8rem;
  color: #d9534f;
  min-height: 1.2em;
}

/* 중복확인 버튼 */
.btn {
  padding: 10px 18px;
  background-color: #b5a0d0;
  color: white;
  border-radius: 8px;
  font-size: 0.85rem;
  font-family: inherit;
  cursor: pointer;
  margin-left: 10px;
  white-space: nowrap;
  user-select: none;
  transition: background-color 0.2s;
}

.btn:hover {
  background-color: #7b4ca1;
}

/* ── 비밀번호 힌트 (p 태그만 가진 div) ── */
.join-main-monitor > div:has(> p) {
  padding-left: 148px;
  margin-top: -8px;
}

.join-main-monitor > div:has(> p) > p {
  color: #a08cc0;
  font-size: 0.8rem;
  margin: 0;
}

/* ── 비밀번호 확인 행 (label + 에러 메시지 div) ── */
.join-main-monitor > div:has(> label):not(:has(.btn)) {
  display: flex;
  flex-direction: column;
  gap: 4px;
}

.join-main-monitor > div:has(> label):not(:has(.btn)) > div {
  padding-left: 148px;
}

.join-main-monitor > div:has(> label):not(:has(.btn)) > div p {
  color: #d9534f;
  font-size: 0.8rem;
  margin: 0;
}

/* ── HR 구분선 ── */
.join-main-monitor hr {
  border: none;
  border-top: 1.5px solid #c5aae0;
  margin: 4px 0;
}

/* ── SUBMIT 버튼 ── */
.join-main-monitor > div:has(> button) {
  display: flex;
  padding-left: 148px;
}

.join-main-monitor button {
  flex: 1;
  padding: 13px;
  background-color: #b5a0d0;
  color: white;
  border: none;
  border-radius: 10px;
  font-size: 1rem;
  font-weight: bold;
  letter-spacing: 3px;
  font-family: inherit;
  cursor: pointer;
  transition: background-color 0.2s;
}

.join-main-monitor button:hover {
  background-color: #7b4ca1;
}
</style>
