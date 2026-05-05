<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-primary">Lectura de Medidores</h1>
          <p class="text-on-surface-variant text-sm mt-1">
            Registra lecturas de agua, electricidad y gas
          </p>
        </div>
        <button
          @click="isModalOpen = true"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <span class="material-symbols-outlined">add</span>
          Nueva Lectura
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
                  Departamento
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Tipo
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Lectura Anterior
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Lectura Actual
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Consumo
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Fecha
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="reading in readings"
                :key="reading.id"
                class="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm font-medium text-on-surface">
                  {{ reading.department }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface">
                  {{ reading.type }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ reading.previousReading }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ reading.currentReading }}
                </td>
                <td class="px-6 py-4 text-sm font-bold text-primary">
                  {{ reading.consumption }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ reading.date }}
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </div>
    </div>

    <!-- Modal for New Reading -->
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
      <template #title>Nueva Lectura</template>
      <FormReading @submit="handleReadingSubmit" @cancel="isModalOpen = false" />
    </Modal>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';
import Modal from '../components/Modal.vue';
import FormReading from '../components/FormReading.vue';

const isModalOpen = ref(false);

const readings = ref([
  {
    id: 1,
    department: '301',
    type: 'Agua',
    previousReading: '1200',
    currentReading: '1250',
    consumption: '50 m³',
    date: '2024-04-20',
  },
  {
    id: 2,
    department: '302',
    type: 'Electricidad',
    previousReading: '5000',
    currentReading: '5150',
    consumption: '150 kWh',
    date: '2024-04-20',
  },
  {
    id: 3,
    department: '401',
    type: 'Gas',
    previousReading: '800',
    currentReading: '850',
    consumption: '50 m³',
    date: '2024-04-20',
  },
]);

const handleReadingSubmit = (formData) => {
  const newReading = {
    id: readings.value.length + 1,
    department: formData.department,
    type: formData.type,
    previousReading: formData.previousReading,
    currentReading: formData.currentReading,
    consumption: formData.consumption + ' ' + formData.unit,
    date: formData.date,
  };
  readings.value.push(newReading);
  isModalOpen.value = false;
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
