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
          <div class="offcanvas-header">
            <h5 class="offcanvas-title" id="offcanvasNavbarLabel">Offcanvas</h5>
            <button type="button" class="btn-close" @click="navClose"></button>
          </div>
          <div class="offcanvas-body">
            <ul class="navbar-nav justify-content-end flex-grow-1 pe-3">
              <li class="nav-item">
                <a class="nav-link active" aria-current="page" href="#">Home</a>
              </li>
              <li class="nav-item">
                <a class="nav-link" href="#">Link</a>
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
