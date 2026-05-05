<template>
  <div class="w-full">
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Dashboard Principal</h2>
        <p class="text-sm text-gray-500 mt-1">Resumen general de las operaciones</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
      <!-- Stats Cards -->
      <div v-for="stat in stats" :key="stat.id" class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
        <div class="flex items-center justify-between">
          <div>
            <p class="text-gray-500 text-sm font-medium">{{ stat.label }}</p>
            <p class="text-2xl font-bold text-gray-900 mt-2">{{ stat.value }}</p>
          </div>
          <div class="p-3 rounded-lg" :style="{ backgroundColor: stat.color }">
            <i :class="stat.icon" class="text-white text-xl"></i>
          </div>
        </div>
      </div>
    </div>

    <!-- Recent Activity -->
    <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
      <h3 class="text-lg font-bold text-gray-800 mb-4">Actividad Reciente</h3>
      <div class="space-y-4">
        <div v-for="activity in recentActivities" :key="activity.id" class="flex items-center gap-4 py-3 border-b border-gray-100 last:border-b-0">
          <div class="w-10 h-10 rounded-full flex items-center justify-center" :style="{ backgroundColor: activity.color }">
            <i :class="activity.icon" class="text-white text-sm"></i>
          </div>
          <div class="flex-1">
            <p class="font-medium text-gray-800">{{ activity.title }}</p>
            <p class="text-sm text-gray-500">{{ activity.description }}</p>
          </div>
          <span class="text-xs text-gray-400">{{ activity.time }}</span>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '../../store/useStore';

const store = useStore();

const stats = ref([
  { id: 1, label: 'Total Departamentos', value: '0', icon: 'pi pi-building', color: '#3B82F6' },
  { id: 2, label: 'Total Inquilinos', value: '0', icon: 'pi pi-users', color: '#10B981' },
  { id: 3, label: 'Contratos Activos', value: '0', icon: 'pi pi-file', color: '#F59E0B' },
  { id: 4, label: 'Pagos Pendientes', value: '$0', icon: 'pi pi-wallet', color: '#EF4444' },
]);

const recentActivities = ref([
  { id: 1, title: 'Nuevo Contrato Registrado', description: 'Contrato para el departamento 301 - Juan Pérez', time: 'Hace 2 horas', icon: 'pi pi-file', color: '#3B82F6' },
  { id: 2, title: 'Pago Recibido', description: '$1,200.00 - Departamento 401', time: 'Hace 4 horas', icon: 'pi pi-wallet', color: '#10B981' },
]);

onMounted(() => {
  stats.value[0].value = store.state.kpis.totalDepartamentos;
  stats.value[1].value = store.state.kpis.totalInquilinos;
  stats.value[2].value = store.state.kpis.contratosActivos;
  stats.value[3].value = `$${store.state.kpis.pagosPendientes}`;
});
</script>
