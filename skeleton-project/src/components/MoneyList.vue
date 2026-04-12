<template>
  <div>
    <h3></h3>
    <router-link :to="{ name: 'moneyListLatest' }"></router-link>
    <router-view name="right"></router-view>
  </div>
</template>
<script setup></script>
