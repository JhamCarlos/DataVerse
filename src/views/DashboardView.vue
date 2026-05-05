<template>
  <DashboardLayout>
    <div class="w-full">
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 mb-8">
        <!-- Stats Cards -->
        <div
          v-for="stat in stats"
          :key="stat.id"
          class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-sm"
        >
          <div class="flex items-center justify-between">
            <div>
              <p class="text-on-surface-variant text-sm font-medium">
                {{ stat.label }}
              </p>
              <p class="text-2xl font-bold text-primary mt-2">
                {{ stat.value }}
              </p>
            </div>
            <div
              class="p-3 rounded-lg"
              :style="{ backgroundColor: stat.color }"
            >
              <span class="material-symbols-outlined text-white">
                {{ stat.icon }}
              </span>
            </div>
          </div>
        </div>
      </div>

      <!-- Recent Activity -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 shadow-sm"
      >
        <h3 class="text-lg font-bold text-primary mb-4">
          Actividad Reciente
        </h3>
        <div class="space-y-4">
          <div
            v-for="activity in recentActivities"
            :key="activity.id"
            class="flex items-center gap-4 py-3 border-b border-outline-variant/10 last:border-b-0"
          >
            <div
              class="w-10 h-10 rounded-full flex items-center justify-center"
              :style="{ backgroundColor: activity.color }"
            >
              <span class="material-symbols-outlined text-white text-sm">
                {{ activity.icon }}
              </span>
            </div>
            <div class="flex-1">
              <p class="font-medium text-on-surface">{{ activity.title }}</p>
              <p class="text-sm text-on-surface-variant">
                {{ activity.description }}
              </p>
            </div>
            <span class="text-xs text-on-surface-variant">
              {{ activity.time }}
            </span>
          </div>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';

const stats = ref([
  {
    id: 1,
    label: 'Total Departamentos',
    value: '24',
    icon: 'domain',
    color: '#00375e',
  },
  {
    id: 2,
    label: 'Total Inquilinos',
    value: '156',
    icon: 'group',
    color: '#516072',
  },
  {
    id: 3,
    label: 'Contratos Activos',
    value: '142',
    icon: 'description',
    color: '#4c2e00',
  },
  {
    id: 4,
    label: 'Pagos Pendientes',
    value: '$45,230',
    icon: 'payments',
    color: '#ba1a1a',
  },
]);

const recentActivities = ref([
  {
    id: 1,
    title: 'Nuevo Contrato Registrado',
    description: 'Contrato para el departamento 301 - Juan Pérez',
    time: 'Hace 2 horas',
    icon: 'description',
    color: '#00375e',
  },
  {
    id: 2,
    title: 'Pago Recibido',
    description: '$1,200.00 - Departamento 401',
    time: 'Hace 4 horas',
    icon: 'payments',
    color: '#4c2e00',
  },
  {
    id: 3,
    title: 'Lectura de Medidor',
    description: 'Medidor de agua - Edificio A',
    time: 'Hace 1 día',
    icon: 'analytics',
    color: '#516072',
  },
  {
    id: 4,
    title: 'Nuevo Inquilino',
    description: 'María García registrada en el sistema',
    time: 'Hace 2 días',
    icon: 'group',
    color: '#ba1a1a',
  },
]);
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
