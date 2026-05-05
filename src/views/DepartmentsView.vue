<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header with Create Button -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-primary">Gestión de Departamentos</h1>
          <p class="text-on-surface-variant text-sm mt-1">
            Administra tu cartera de propiedades
          </p>
        </div>
        <button
          @click="isModalOpen = true"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <span class="material-symbols-outlined">add</span>
          Nuevo Departamento
        </button>
      </div>

      <!-- Grid of Departments -->
      <div class="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        <div
          v-for="dept in departments"
          :key="dept.id"
          class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6 hover:shadow-md transition-all cursor-pointer"
        >
          <div class="flex justify-between items-start mb-4">
            <div>
              <h3 class="text-xl font-bold text-primary">{{ dept.number }}</h3>
              <p class="text-sm text-on-surface-variant">{{ dept.location }}</p>
            </div>
            <div class="relative">
              <button
                @click.stop="openActions(dept.id)"
                class="text-[#00375e] hover:bg-[#e6e8eb] rounded-lg p-2 transition-colors"
              >
                <span class="material-symbols-outlined">more_vert</span>
              </button>
              <div v-if="actionsOpen === dept.id" class="absolute right-0 mt-2 w-36 bg-white border border-outline-variant/20 rounded-lg shadow-lg z-10">
                <button @click="editDepartment(dept)" class="w-full text-left px-4 py-2 hover:bg-[#e6e8eb] text-[#00375e]">Editar</button>
                <button @click="deleteDepartment(dept.id)" class="w-full text-left px-4 py-2 hover:bg-[#ffeaea] text-[#ba1a1a]">Eliminar</button>
              </div>
            </div>
          </div>

          <div class="space-y-3">
            <div class="flex justify-between items-center text-sm">
              <span class="text-on-surface-variant">Inquilino:</span>
              <span class="font-medium text-on-surface">{{ dept.tenant }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-on-surface-variant">Área:</span>
              <span class="font-medium text-on-surface">{{ dept.area }}</span>
            </div>
            <div class="flex justify-between items-center text-sm">
              <span class="text-on-surface-variant">Renta:</span>
              <span class="font-bold text-primary">{{ dept.rent }}</span>
            </div>
          </div>

          <div class="mt-4 pt-4 border-t border-outline-variant/10">
            <span
              class="px-3 py-1 rounded-full text-[12px] font-bold"
              :class="[
                dept.status === 'Ocupado'
                  ? 'bg-green-100 text-green-800'
                  : 'bg-yellow-100 text-yellow-800',
              ]"
            >
              {{ dept.status }}
            </span>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for New/Edit Department -->
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
      <template #title>
        {{ modalTitle }}
      </template>
      <FormDepartment :department="selectedDepartment" @submit="handleDepartmentSubmit" @cancel="isModalOpen = false" />
    </Modal>
  </DashboardLayout>
</template>

<script setup>
import { ref } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';
import Modal from '../components/Modal.vue';
import FormDepartment from '../components/FormDepartment.vue';

const isModalOpen = ref(false);
const actionsOpen = ref(null);
const selectedDepartment = ref(null);
const modalTitle = ref('Nuevo Departamento');

const departments = ref([
  {
    id: 1,
    number: '301',
    location: 'Edificio A - Piso 3',
    tenant: 'Juan Pérez',
    area: '85 m²',
    rent: '$1,200.00',
    status: 'Ocupado',
  },
  {
    id: 2,
    number: '302',
    location: 'Edificio A - Piso 3',
    tenant: 'María García',
    area: '85 m²',
    rent: '$1,200.00',
    status: 'Ocupado',
  },
  {
    id: 3,
    number: '401',
    location: 'Edificio A - Piso 4',
    tenant: 'Carlos López',
    area: '95 m²',
    rent: '$1,400.00',
    status: 'Ocupado',
  },
  {
    id: 4,
    number: '402',
    location: 'Edificio A - Piso 4',
    tenant: '-',
    area: '95 m²',
    rent: '$1,400.00',
    status: 'Disponible',
  },
  {
    id: 5,
    number: '501',
    location: 'Edificio A - Piso 5',
    tenant: 'Roberto Sánchez',
    area: '110 m²',
    rent: '$1,600.00',
    status: 'Ocupado',
  },
  {
    id: 6,
    number: '502',
    location: 'Edificio A - Piso 5',
    tenant: '-',
    area: '110 m²',
    rent: '$1,600.00',
    status: 'Disponible',
  },
]);

const handleDepartmentSubmit = (formData) => {
  if (selectedDepartment.value) {
    // Editar existente
    const idx = departments.value.findIndex(d => d.id === selectedDepartment.value.id);
    if (idx !== -1) {
      departments.value[idx] = {
        ...departments.value[idx],
        ...formData,
        area: formData.area + ' m²',
        rent: '$' + Number(formData.rent).toFixed(2),
      };
    }
  } else {
    // Nuevo
    const newDepartment = {
      id: departments.value.length + 1,
      number: formData.number,
      location: formData.location,
      tenant: formData.tenant || '-',
      area: formData.area + ' m²',
      rent: '$' + Number(formData.rent).toFixed(2),
      status: formData.status,
    };
    departments.value.push(newDepartment);
  }
  isModalOpen.value = false;
  selectedDepartment.value = null;
  actionsOpen.value = null;
  modalTitle.value = 'Nuevo Departamento';
};

function openActions(id) {
  actionsOpen.value = actionsOpen.value === id ? null : id;
}

function editDepartment(dept) {
  selectedDepartment.value = { ...dept };
  isModalOpen.value = true;
  modalTitle.value = 'Editar Departamento';
  actionsOpen.value = null;
}

function deleteDepartment(id) {
  departments.value = departments.value.filter(d => d.id !== id);
  actionsOpen.value = null;
}

document.addEventListener('click', (e) => {
  actionsOpen.value = null;
});
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
