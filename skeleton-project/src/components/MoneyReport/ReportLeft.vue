<template>
  <div>
    <h1>수입</h1>
    <div style="width: 400px; height: 400px">
      <Doughnut v-if="render" :data="chartData" :options="chartOptions" />
    </div>
  </div>
</template>
<script setup>
import { computed, ref, watch, nextTick } from 'vue';
import { Doughnut } from 'vue-chartjs';
import {
  Chart as ChartJS,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  CategoryScale,
} from 'chart.js';

const props = defineProps({
  category: Array,
  data: Array,
});

const render = ref(false);

// Chart.js에 필요한 요소 등록
ChartJS.register(Title, Tooltip, Legend, ArcElement, CategoryScale);

const chartData = ref({
  labels: [],
  datasets: [
    {
      backgroundColor: ['#41B883', '#61DAFB', '#DD0031', '#FF3E00'],
      data: [],
    },
  ],
});

//  props 들어오면 강제 업데이트
watch(
  () => props.data,
  async (newData) => {
    if (!newData?.length) return;

    render.value = false; // 컴포넌트 강제로 끄기

    await nextTick(); // 화면 랜더링 기다리기

    chartData.value = {
      labels: props.category,
      datasets: [
        {
          backgroundColor: ['#41B883', '#61DAFB', '#DD0031', '#FF3E00'],
          data: newData,
        },
      ],
    };
    render.value = true; // 컴포넌트 강제 리렌더
  },
  { immediate: true },
);

const chartOptions = {
  responsive: true,
  maintainAspectRatio: false,
  plugins: {
    legend: {
      position: 'right',
    },
  },
};

console.log(props.data, '222');
</script>
