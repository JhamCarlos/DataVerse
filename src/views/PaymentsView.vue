<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-primary">Pagos</h1>
          <p class="text-on-surface-variant text-sm mt-1">
            Registra y valida pagos de inquilinos
          </p>
        </div>
        <button
          @click="isModalOpen = true"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <span class="material-symbols-outlined">add</span>
          Registrar Pago
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
                  Referencia
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Inquilino
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Departamento
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Monto
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Fecha
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Método
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Estado
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="payment in payments"
                :key="payment.id"
                class="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-on-surface">
                  {{ payment.reference }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface">
                  {{ payment.tenant }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ payment.department }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-primary">
                  {{ payment.amount }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ payment.date }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ payment.method }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    class="px-3 py-1 rounded-full text-[12px] font-bold"
                    :class="[
                      payment.status === 'Confirmado'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-blue-100 text-blue-800',
                    ]"
                  >
                    {{ payment.status }}
                  </span>
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for New Payment -->
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
      <template #title>Registrar Pago</template>
      <FormPayment @submit="handlePaymentSubmit" @cancel="isModalOpen = false" />
    </Modal>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';
import Modal from '../components/Modal.vue';
import FormPayment from '../components/FormPayment.vue';

const isModalOpen = ref(false);

const payments = ref([
  {
    id: 1,
    reference: 'PAG-001',
    tenant: 'Juan Pérez',
    department: '301',
    amount: '$1,350.00',
    date: '2024-04-18',
    method: 'Transferencia',
    status: 'Confirmado',
  },
  {
    id: 2,
    reference: 'PAG-002',
    tenant: 'Carlos López',
    department: '401',
    amount: '$1,600.00',
    date: '2024-04-19',
    method: 'Cheque',
    status: 'Confirmado',
  },
  {
    id: 3,
    reference: 'PAG-003',
    tenant: 'María García',
    department: '302',
    amount: '$1,380.00',
    date: '2024-04-20',
    method: 'Tarjeta',
    status: 'Pendiente',
  },
]);

const handlePaymentSubmit = (formData) => {
  const newPayment = {
    id: payments.value.length + 1,
    reference: formData.reference,
    tenant: formData.tenant,
    department: formData.department,
    amount: '$' + formData.amount.toFixed(2),
    date: formData.date,
    method: formData.method,
    status: formData.status,
  };
  payments.value.push(newPayment);
  isModalOpen.value = false;
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
