import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';

export const useLoginStore = defineStore('login', () => {
  // login 구현 Part
  // // states
  // const user = ref({});

  // // actions
  // const login = async (inputId, inputPw) => {
  //   let users = [];

  //   // db.json에서 회원 정보 받아오기
  //   const resp = await axios.get('/api/users');
  //   users = resp.data;
  //   // console.log('받아온 회원정보', users);

  //   // 입력받은 id값으로 회원 정보를 찾기
  //   for (let i = 0; i < users.length; i++) {
  //     if (inputId === users[i].userID.toString()) {
  //       // id가 일치하는 정보가 있으면 비밀번호 일치 확인
  //       // console.log('아이디가 일치하는 회원 객체', users[i]);

  //       if (inputPw === users[i].userPW.toString()) {
  //         const selectedUser = users[i];
  //         user.value.id = selectedUser.id;
  //         user.value.userID = selectedUser.userID;
  //         user.value.userName = selectedUser.userName;
  //         // console.log('활용할 회원 정보', user.value);
  //         return;
  //       }
  //       // console.log('비밀번호 미일치');
  //       return;
  //     }
  //     // console.log('회원정보 없음');
  //   }
  // };
  // return { user, login };

  const user = ref({ id: 1, userID: 'hj4094', userName: '한혜지' });
  return { user };
});
