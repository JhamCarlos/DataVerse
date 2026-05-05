<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-primary">Liquidaciones</h1>
          <p class="text-on-surface-variant text-sm mt-1">
            Revisa y genera reportes de liquidación
          </p>
        </div>
        <button
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <span class="material-symbols-outlined">file_download</span>
          Descargar
        </button>
      </div>

      <div
        class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-surface-container border-b border-outline-variant/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Período
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Departamento
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Renta
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Servicios
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Total
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="settlement in settlements"
                :key="settlement.id"
                class="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-on-surface">
                  {{ settlement.period }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface">
                  {{ settlement.department }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ settlement.rent }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ settlement.services }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-primary">
                  {{ settlement.total }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    class="px-3 py-1 rounded-full text-[12px] font-bold"
                    :class="[
                      settlement.status === 'Pagado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-yellow-100 text-yellow-800',
                    ]"
                  >
                    {{ settlement.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';

const settlements = ref([
  {
    id: 1,
    period: 'Abril 2024',
    department: '301',
    rent: '$1,200.00',
    services: '$150.00',
    total: '$1,350.00',
    status: 'Pagado',
  },
  {
    id: 2,
    period: 'Abril 2024',
    department: '302',
    rent: '$1,200.00',
    services: '$180.00',
    total: '$1,380.00',
    status: 'Pendiente',
  },
  {
    id: 3,
    period: 'Abril 2024',
    department: '401',
    rent: '$1,400.00',
    services: '$200.00',
    total: '$1,600.00',
    status: 'Pagado',
  },
]);
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
