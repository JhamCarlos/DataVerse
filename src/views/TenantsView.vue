<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <!-- Header with Create Button -->
      <div class="flex justify-between items-center mb-6">
        <div>
          <h1 class="text-3xl font-bold text-primary">Gestión de Inquilinos</h1>
          <p class="text-on-surface-variant text-sm mt-1">
            Administra la lista completa de inquilinos
          </p>
        </div>
        <button
          @click="isModalOpen = true"
          class="bg-primary-container text-white px-6 py-3 rounded-lg font-bold flex items-center gap-2 hover:opacity-95 transition-all"
        >
          <span class="material-symbols-outlined">add</span>
          Nuevo Inquilino
        </button>
      </div>

      <!-- Search and Filter -->
      <div class="mb-6 flex gap-4">
        <div class="flex-1 relative">
          <span class="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-on-surface-variant">
            search
          </span>
          <input
            v-model="searchQuery"
            type="text"
            placeholder="Buscar inquilino..."
            class="w-full pl-10 pr-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
          />
        </div>
        <button
          class="px-6 py-3 border border-outline-variant/30 rounded-lg text-on-surface-variant hover:bg-surface-container transition-all flex items-center gap-2"
        >
          <span class="material-symbols-outlined">filter_list</span>
          Filtros
        </button>
      </div>

      <!-- Tenants Table -->
      <div
        class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl overflow-hidden shadow-sm"
      >
        <div class="overflow-x-auto">
          <table class="w-full">
            <thead class="bg-surface-container border-b border-outline-variant/20">
              <tr>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Nombre
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Email
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Teléfono
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Departamento
                </th>
                <th class="px-6 py-4 text-left text-sm font-bold text-on-surface">
                  Estado
                </th>
                <th class="px-6 py-4 text-right text-sm font-bold text-on-surface">
                  Acciones
                </th>
              </tr>
            </thead>
            <tbody>
              <tr
                v-for="tenant in filteredTenants"
                :key="tenant.id"
                class="border-b border-outline-variant/10 hover:bg-surface-container/50 transition-colors"
              >
                <td class="px-6 py-4 text-sm text-on-surface font-medium">
                  <div class="flex items-center gap-3">
                    <img
                      :alt="tenant.name"
                      :src="tenant.avatar"
                      class="w-8 h-8 rounded-full object-cover bg-primary-container"
                    />
                    {{ tenant.name }}
                  </div>
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ tenant.email }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface-variant">
                  {{ tenant.phone }}
                </td>
                <td class="px-6 py-4 text-sm text-on-surface">
                  {{ tenant.department }}
                </td>
                <td class="px-6 py-4 text-sm">
                  <span
                    class="px-3 py-1 rounded-full text-[12px] font-bold"
                    :class="[
                      tenant.status === 'Activo'
                        ? 'bg-green-100 text-green-800'
                        : 'bg-red-100 text-red-800',
                    ]"
                  >
                    {{ tenant.status }}
                  </span>
                </td>
                <td class="px-6 py-4 text-right">
                  <button
                    class="text-primary hover:bg-surface-container rounded-lg p-2 transition-colors"
                  >
                    <span class="material-symbols-outlined text-[20px]">
                      more_vert
                    </span>
                  </button>
                </td>
              </tr>
            </tbody>
          </table>
        </div>

        <!-- Pagination -->
        <div
          class="px-6 py-4 border-t border-outline-variant/20 flex justify-between items-center bg-surface-container/50"
        >
          <p class="text-sm text-on-surface-variant">
            Mostrando 1 a 10 de {{ tenants.length }} inquilinos
          </p>
          <div class="flex gap-2">
            <button
              class="px-3 py-2 border border-outline-variant/30 rounded-lg text-sm hover:bg-surface-container transition-all"
            >
              Anterior
            </button>
            <button
              class="px-3 py-2 border border-outline-variant/30 rounded-lg text-sm hover:bg-surface-container transition-all"
            >
              Siguiente
            </button>
          </div>
        </div>
      </div>
    </div>

    <!-- Modal for New/Edit Tenant -->
    <Modal :isOpen="isModalOpen" @close="isModalOpen = false">
      <template #title>Nuevo Inquilino</template>
      <FormTenant @submit="handleTenantSubmit" @cancel="isModalOpen = false" />
    </Modal>
  </DashboardLayout>
</template>

<script setup>
import { ref, computed } from 'vue';
import DashboardLayout from '../components/DashboardLayout.vue';
import Modal from '../components/Modal.vue';
import FormTenant from '../components/FormTenant.vue';

const isModalOpen = ref(false);
const searchQuery = ref('');

const tenants = ref([
  {
    id: 1,
    name: 'Juan Pérez',
    email: 'juan.perez@email.com',
    phone: '+56 9 1234 5678',
    department: '301',
    status: 'Activo',
    avatar: 'https://ui-avatars.com/api/?name=Juan+Perez&background=00375e&color=fff',
  },
  {
    id: 2,
    name: 'María García',
    email: 'maria.garcia@email.com',
    phone: '+56 9 8765 4321',
    department: '302',
    status: 'Activo',
    avatar: 'https://ui-avatars.com/api/?name=Maria+Garcia&background=516072&color=fff',
  },
  {
    id: 3,
    name: 'Carlos López',
    email: 'carlos.lopez@email.com',
    phone: '+56 9 1111 2222',
    department: '401',
    status: 'Activo',
    avatar: 'https://ui-avatars.com/api/?name=Carlos+Lopez&background=4c2e00&color=fff',
  },
  {
    id: 4,
    name: 'Ana Martínez',
    email: 'ana.martinez@email.com',
    phone: '+56 9 3333 4444',
    department: '402',
    status: 'Inactivo',
    avatar: 'https://ui-avatars.com/api/?name=Ana+Martinez&background=ba1a1a&color=fff',
  },
  {
    id: 5,
    name: 'Roberto Sánchez',
    email: 'roberto.sanchez@email.com',
    phone: '+56 9 5555 6666',
    department: '501',
    status: 'Activo',
    avatar: 'https://ui-avatars.com/api/?name=Roberto+Sanchez&background=00375e&color=fff',
  },
]);

const filteredTenants = computed(() => {
  if (!searchQuery.value) return tenants.value;
  return tenants.value.filter((tenant) =>
    tenant.name.toLowerCase().includes(searchQuery.value.toLowerCase())
  );
});

const handleTenantSubmit = (formData) => {
  const newTenant = {
    id: tenants.value.length + 1,
    name: formData.name,
    email: formData.email,
    phone: formData.phone,
    department: formData.department,
    status: formData.status,
    avatar: `https://ui-avatars.com/api/?name=${formData.name}&background=00375e&color=fff`,
  };
  tenants.value.push(newTenant);
  isModalOpen.value = false;
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
