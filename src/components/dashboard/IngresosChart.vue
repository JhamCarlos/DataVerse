<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Ingresos Financieros</h3>
    
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
      <div class="bg-green-50 border border-green-200 rounded-lg p-4">
        <p class="text-gray-600 text-sm font-medium">Total Ingresos</p>
        <p class="text-2xl font-bold text-green-600 mt-1">
          {{ formatCurrency(ingresos) }}
        </p>
      </div>
      <div class="bg-blue-50 border border-blue-200 rounded-lg p-4">
        <p class="text-gray-600 text-sm font-medium">Boletas Pagadas</p>
        <p class="text-2xl font-bold text-blue-600 mt-1">
          {{ boletasPagadas }}
        </p>
      </div>
      <div class="bg-purple-50 border border-purple-200 rounded-lg p-4">
        <p class="text-gray-600 text-sm font-medium">Promedio por Boleta</p>
        <p class="text-2xl font-bold text-purple-600 mt-1">
          {{ formatCurrency(promedioIngreso) }}
        </p>
      </div>
    </div>

    <div class="bg-gray-50 rounded-lg p-4">
      <p class="text-sm font-medium text-gray-700 mb-3">Desglose de Ingresos</p>
      <div class="space-y-2">
        <div class="flex justify-between items-center pb-2 border-b border-gray-200">
          <span class="text-sm text-gray-600">Alquileres</span>
          <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(totalAlquileres) }}</span>
        </div>
        <div class="flex justify-between items-center pb-2 border-b border-gray-200">
          <span class="text-sm text-gray-600">Servicios (Agua, Luz)</span>
          <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(totalServicios) }}</span>
        </div>
        <div class="flex justify-between items-center pb-2 border-b border-gray-200">
          <span class="text-sm text-gray-600">Mantenimiento</span>
          <span class="text-sm font-semibold text-gray-900">{{ formatCurrency(totalMantenimiento) }}</span>
        </div>
        <div class="flex justify-between items-center pt-2">
          <span class="text-sm font-semibold text-gray-700">Total Generado</span>
          <span class="text-sm font-bold text-green-600">{{ formatCurrency(totalGenerado) }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '../../store/useStore';

const store = useStore();

const ingresos = computed(() => store.ingresos.value);
const boletasPagadas = computed(() => store.boletasPagadas.value);

const promedioIngreso = computed(() => {
  if (boletasPagadas.value === 0) return 0;
  return ingresos.value / boletasPagadas.value;
});

const totalAlquileres = computed(() => {
  return store.state.boletas
    .filter(b => b.estado_boleta === 'PAGADA')
    .reduce((sum, b) => sum + b.monto_alquiler, 0);
});

const totalServicios = computed(() => {
  return store.state.boletas
    .filter(b => b.estado_boleta === 'PAGADA')
    .reduce((sum, b) => sum + (b.monto_agua + b.monto_luz), 0);
});

const totalMantenimiento = computed(() => {
  return store.state.boletas
    .filter(b => b.estado_boleta === 'PAGADA')
    .reduce((sum, b) => sum + b.monto_mantenimiento, 0);
});

const totalGenerado = computed(() => {
  return store.state.boletas
    .filter(b => b.estado_boleta === 'PAGADA')
    .reduce((sum, b) => sum + b.monto_total, 0);
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value);
};
</script>
