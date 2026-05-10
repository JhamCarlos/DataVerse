<template>
  <div class="w-full">
    <!-- Encabezado -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Dashboard de Ayuda (Toma de Decisiones)</h2>
        <p class="text-sm text-gray-500 mt-1">KPIs financieros en tiempo real para la gestión de Milano & Asociados</p>
      </div>
      <button
        @click="actualizarDatos"
        class="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors flex items-center gap-2"
      >
        <i class="pi pi-refresh text-sm"></i>
        Actualizar
      </button>
    </div>

    <!-- Indicadores Principales -->
    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <KPICard
        label="Ocupación"
        :value="store.ocupacion.value"
        icon="pi pi-building"
        iconBgColor="#10B981"
        format="percentage"
        :subtitle="`${store.departamentosOcupados.value} de ${store.totalDepartamentos.value}`"
      />
      <KPICard
        label="Morosidad"
        :value="store.morosidad.value"
        icon="pi pi-exclamation-triangle"
        iconBgColor="#EF4444"
        format="currency"
        :subtitle="`${store.boletasPendientes.value} boletas atrasadas`"
      />
      <KPICard
        label="Ingresos Procesados"
        :value="store.ingresos.value"
        icon="pi pi-wallet"
        iconBgColor="#3B82F6"
        format="currency"
        :subtitle="`${store.boletasPagadas.value} boletas pagadas`"
      />
      <KPICard
        label="Total Departamentos"
        :value="store.totalDepartamentos.value"
        icon="pi pi-home"
        iconBgColor="#F59E0B"
        :subtitle="`${store.departamentosDisponibles.value} disponibles`"
      />
    </div>

    <!-- Alertas -->
    <div class="mb-8">
      <AlertasChart />
    </div>

    <!-- Gráficos y Análisis -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6 mb-8">
      <!-- Ocupación -->
      <OcupacionChart />
      
      <!-- Morosidad -->
      <MorosidadChart />
    </div>

    <!-- Ingresos Financieros -->
    <div class="mb-8">
      <IngresosChart />
    </div>

    <!-- Notificación de Impacto en Vivo -->
    <div class="bg-gradient-to-r from-blue-50 to-indigo-50 border border-blue-200 rounded-xl p-6">
      <div class="flex items-start gap-4">
        <div class="p-2 bg-blue-100 rounded-lg">
          <i class="pi pi-info-circle text-blue-600 text-xl"></i>
        </div>
        <div>
          <h3 class="font-semibold text-gray-800">✓ Impacto en Vivo Activo</h3>
          <p class="text-sm text-gray-600 mt-1">
            Los datos registrados en el bloque anterior se actualizan automáticamente en este dashboard.
            Cada nueva boleta, pago o cambio de ocupación se refleja instantáneamente en los gráficos y KPIs.
          </p>
          <div class="mt-3 flex gap-4 text-xs text-gray-700">
            <div class="flex items-center gap-1">
              <i class="pi pi-check-circle text-green-600"></i>
              <span>Morosidad actualizada</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="pi pi-check-circle text-green-600"></i>
              <span>Ingresos en vivo</span>
            </div>
            <div class="flex items-center gap-1">
              <i class="pi pi-check-circle text-green-600"></i>
              <span>Ocupación dinámica</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { useStore } from '../../store/useStore';
import KPICard from './KPICard.vue';
import OcupacionChart from './OcupacionChart.vue';
import MorosidadChart from './MorosidadChart.vue';
import IngresosChart from './IngresosChart.vue';
import AlertasChart from './AlertasChart.vue';

const store = useStore();

const actualizarDatos = () => {
  // Trigger re-computation
  window.location.reload();
};
</script>
