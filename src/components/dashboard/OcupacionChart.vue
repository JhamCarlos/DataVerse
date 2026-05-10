<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Ocupación de Departamentos</h3>
    <div class="flex items-center justify-center">
      <Pie :data="chartData" :options="chartOptions" />
    </div>
    <div class="grid grid-cols-2 gap-4 mt-6">
      <div class="text-center">
        <p class="text-2xl font-bold text-green-600">{{ ocupados }}</p>
        <p class="text-sm text-gray-600">Ocupados</p>
      </div>
      <div class="text-center">
        <p class="text-2xl font-bold text-orange-500">{{ disponibles }}</p>
        <p class="text-sm text-gray-600">Disponibles</p>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { Pie } from 'vue-chartjs';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { useStore } from '../../store/useStore';

ChartJS.register(ArcElement, Tooltip, Legend);

const store = useStore();

const ocupados = computed(() => store.departamentosOcupados.value);
const disponibles = computed(() => store.departamentosDisponibles.value);

const chartData = computed(() => ({
  labels: ['Ocupados', 'Disponibles'],
  datasets: [
    {
      data: [ocupados.value, disponibles.value],
      backgroundColor: ['#10B981', '#F59E0B'],
      borderColor: ['#059669', '#D97706'],
      borderWidth: 2
    }
  ]
}));

const chartOptions = {
  responsive: true,
  maintainAspectRatio: true,
  plugins: {
    legend: {
      position: 'bottom',
      labels: {
        usePointStyle: true,
        padding: 20,
        font: {
          size: 13
        }
      }
    }
  }
};
</script>
