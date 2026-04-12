<template>
  <div>
    <nav class="navbar float-end">
      <div class="container-fluid">
        <button class="navbar-toggler" type="button" @click="changeNav">
          <span class="navbar-toggler-icon"></span>
        </button>
        <div
          class="offcanvas offcanvas-end"
          tabindex="-1"
          id="offcanvasNavbar"
          :class="navClass"
        >
          <div class="offcanvas-header mt-5">
            <h4
              class="offcanvas-title cursor-default"
              id="offcanvasNavbarLabel"
            >
              Loding account book
            </h4>
            <button
              type="button"
              class="btn-close ms-5"
              @click="navClose"
            ></button>
          </div>
          <div class="offcanvas-body">
            <ul
              class="navbar-nav justify-content-end flex-grow-1 pe-3 d-flex justify-content-center"
            >
              <li
                class="nav-item text-center text-select"
                @click.stop="emit('go-home')"
              >
                홈
              </li>
              <hr />
              <li
                class="nav-item text-center text-select"
                @click.stop="emit('go-options-transaction')"
              >
                거래내역 조회
              </li>
              <hr />
              <li
                class="nav-item text-center text-select"
                @click.stop="emit('go-options-budget')"
              >
                예산 확인
              </li>
              <hr />
              <li
                class="nav-item text-center text-select"
                @click.stop="emit('go-options-report')"
              >
                월별 리포트
              </li>
            </ul>
          </div>
        </div>
      </div>
    </nav>
  </div>
</template>
<script setup>
import { reactive, computed } from 'vue';

const emit = defineEmits([
  'go-home',
  'go-options/transaction',
  'go-options/budget',
  'go-options-report',
]);

const navClass = computed(
  () =>
    state.isNavShow
      ? 'collapse navbar-collapse show' // true면 메뉴를 보여주는 클래스 적용
      : 'collapse navbar-collapse', // false면 메뉴를 숨기는 클래스 적용
);

const state = reactive({ isNavShow: false });
const changeNav = () => {
  state.isNavShow = !state.isNavShow;
  // 버튼을 누를 때마다 상태를 반대로 뒤집습니다 (Toggle).
};

const navClose = () => {
  state.isNavShow = false;
};
</script>
