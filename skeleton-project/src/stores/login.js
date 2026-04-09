import { ref, computed } from 'vue';
import { defineStore } from 'pinia';
import axios from 'axios';
import { useRouter } from 'vue-router';

export const useLoginStore = defineStore('login', () => {
  // // login 구현 Part
  // // states
  // const user = ref({});
  // let undeID = ref(0);
  // let undePW = ref(0);

  // // actions
  // const login = async (inputId, inputPw) => {
  //   let users = [];

  //   // db.json에서 회원 정보 받아오기
  //   const resp = await axios.get('/api/users');
  //   users = resp.data;
  //   // console.log('받아온 회원정보', users);
  //   // console.log('id 일치여부 관련 정보', undeID.value);
  //   // console.log('pw 일치여부 관련 정보', undePW.value);

  //   // 입력받은 id값으로 회원 정보를 찾기
  //   for (let i = 0; i < users.length; i++) {
  //     if (inputId === users[i].userID.toString()) {
  //       // id가 일치하는 정보가 있으면 비밀번호 일치 확인
  //       // console.log('아이디가 일치하는 회원 객체', users[i]);
  //       undeID.value = 0;

  //       // console.log('id 일치여부 관련 정보2', undeID.value);
  //       // console.log('pw 일치여부 관련 정보2', undePW.value);

  //       if (inputPw === users[i].userPW.toString()) {
  //         undePW.value = 0;
  //         const selectedUser = users[i];
  //         user.value.id = selectedUser.id;
  //         user.value.userID = selectedUser.userID;
  //         user.value.userName = selectedUser.userName;

  //         // console.log('활용할 회원 정보', user.value);

  //         // console.log('id 일치여부 관련 정보3', undeID.value);
  //         // console.log('pw 일치여부 관련 정보3', undePW.value);
  //         return 'success';
  //       }
  //       // console.log('비밀번호 미일치');
  //       undePW.value = 1;

  //       // console.log('id 일치여부 관련 정보4', undeID.value);
  //       // console.log('pw 일치여부 관련 정보4', undePW.value);
  //       return 'rejected';
  //     }
  //     // console.log('회원정보 없음');
  //     undeID.value = 1;

  //     // console.log('id 일치여부 관련 정보5', undeID.value);
  //     // console.log('pw 일치여부 관련 정보5', undePW.value);
  //     return 'rejected';
  //   }
  // };
  // return { user, undeID, undePW, login };

  const user = ref({ id: 1, userID: 'hj4094', userName: '한혜지' });
  let undeID = ref(0);
  let undePW = ref(0);
  return { user, undeID, undePW };
});
