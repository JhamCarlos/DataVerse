<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-primary">Gestión de Contratos</h1>
          <p class="text-on-surface-variant text-sm mt-1">
            Registra y gestiona contratos de arrendamiento
          </p>
        </div>
        <button
          @click="isModalOpen = true"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <span class="material-symbols-outlined">add</span>
          Nuevo Contrato
        </button>
      </div>

      <!-- Contracts Table -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-surface-container border-b border-outline-variant/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Número
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Inquilino
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Departamento
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Desde
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Hasta
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Renta
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="contract in contracts"
                :key="contract.id"
                class="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-on-surface">
                  {{ contract.number }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface">
                  {{ contract.tenant }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ contract.department }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ contract.startDate }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ contract.endDate }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-primary">
                  {{ contract.rent }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    class="px-3 py-1 rounded-full text-[12px] font-bold"
                    :class="[
                      contract.status === 'Vigente'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-gray-100 text-gray-800',
                    ]"
                  >
                    {{ contract.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for New/Edit Contract -->
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
      <template #title>Nuevo Contrato</template>
      <FormContract @submit="handleContractSubmit" @cancel="isModalOpen = false" />
    </Modal>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';
import Modal from '../components/Modal.vue';
import FormContract from '../components/FormContract.vue';

const isModalOpen = ref(false);

const contracts = ref([
  {
    id: 1,
    number: 'CTR-001',
    tenant: 'Juan Pérez',
    department: '301',
    startDate: '01/01/2023',
    endDate: '01/01/2024',
    rent: '$1,200.00',
    status: 'Vigente',
  },
  {
    id: 2,
    number: 'CTR-002',
    tenant: 'María García',
    department: '302',
    startDate: '15/02/2023',
    endDate: '15/02/2024',
    rent: '$1,200.00',
    status: 'Vigente',
  },
  {
    id: 3,
    number: 'CTR-003',
    tenant: 'Carlos López',
    department: '401',
    startDate: '01/03/2023',
    endDate: '01/03/2024',
    rent: '$1,400.00',
    status: 'Vigente',
  },
]);

const handleContractSubmit = (formData) => {
  const newContract = {
    id: contracts.value.length + 1,
    number: formData.number,
    tenant: formData.tenant,
    department: formData.department,
    startDate: formData.startDate,
    endDate: formData.endDate,
    rent: '$' + formData.rent.toFixed(2),
    status: formData.status,
  };
  contracts.value.push(newContract);
  isModalOpen.value = false;
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
