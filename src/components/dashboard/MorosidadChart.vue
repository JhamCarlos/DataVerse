<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Análisis de Morosidad</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mb-6">
      <div class="bg-red-50 border border-red-200 rounded-lg p-4">
        <p class="text-gray-600 text-sm font-medium">Monto en Mora</p>
        <p class="text-2xl font-bold text-red-600 mt-1">
          {{ formatCurrency(morosidad) }}
        </p>
      </div>
      <div class="bg-orange-50 border border-orange-200 rounded-lg p-4">
        <p class="text-gray-600 text-sm font-medium">Boletas Pendientes</p>
        <p class="text-2xl font-bold text-orange-600 mt-1">
          {{ boletasPendientes }}
        </p>
      </div>
    </div>

    <div class="mb-4">
      <p class="text-sm font-medium text-gray-700 mb-3">Estado de Pagos</p>
      <div class="space-y-3">
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm text-gray-600">Pagadas</span>
            <span class="text-sm font-semibold text-green-600">{{ boletasPagadas }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-green-500 h-2 rounded-full"
              :style="{ width: calculoProgreso.pagadas + '%' }"
            ></div>
          </div>
        </div>
        <div>
          <div class="flex justify-between items-center mb-1">
            <span class="text-sm text-gray-600">Pendientes</span>
            <span class="text-sm font-semibold text-orange-600">{{ boletasPendientes }}</span>
          </div>
          <div class="w-full bg-gray-200 rounded-full h-2">
            <div
              class="bg-orange-500 h-2 rounded-full"
              :style="{ width: calculoProgreso.pendientes + '%' }"
            ></div>
          </div>
        </div>
      </div>
    </div>

    <div class="text-xs text-gray-500 p-3 bg-gray-50 rounded-lg">
      <p>✓ Tasa de Cobranza: <span class="font-semibold text-gray-700">{{ tasaCobranza }}%</span></p>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '../../store/useStore';

const store = useStore();

const morosidad = computed(() => store.morosidad.value);
const boletasPendientes = computed(() => store.boletasPendientes.value);
const boletasPagadas = computed(() => store.boletasPagadas.value);

const totalBoletas = computed(() => store.state.boletas.length);

const tasaCobranza = computed(() => {
  if (totalBoletas.value === 0) return 0;
  return Math.round((boletasPagadas.value / totalBoletas.value) * 100);
});

const calculoProgreso = computed(() => {
  const total = boletasPagadas.value + boletasPendientes.value || 1;
  return {
    pagadas: (boletasPagadas.value / total) * 100,
    pendientes: (boletasPendientes.value / total) * 100
  };
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value);
};
</script>
