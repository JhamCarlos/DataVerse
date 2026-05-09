<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Roles y Permisos</h2>
        <p class="text-sm text-gray-500 mt-1">Define los perfiles de acceso y sus capacidades en el sistema</p>
      </div>
    </div>

    <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
      <!-- Tabla de Roles -->
      <div class="lg:col-span-2 space-y-4">
        <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
          <DataTable :value="roles" class="p-datatable-sm" responsiveLayout="scroll">
            <Column field="nombre" header="Rol" style="width: 30%">
              <template #body="{ data }">
                <span class="font-bold text-primary">{{ data.nombre }}</span>
              </template>
            </Column>
            <Column field="descripcion" header="Descripción"></Column>
            <Column header="Acciones" style="width: 15%; text-align: center">
              <template #body>
                <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info" v-tooltip.top="'Editar Rol'" />
              </template>
            </Column>
          </DataTable>
        </div>
      </div>

      <!-- Lista de Permisos -->
      <div class="space-y-4">
        <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
          <h3 class="text-lg font-semibold text-gray-700 mb-4 flex items-center gap-2">
            <i class="pi pi-key text-yellow-600"></i> Permisos Disponibles
          </h3>
          <ul class="space-y-2">
            <li v-for="permiso in permisos" :key="permiso.id" class="p-3 bg-gray-50 rounded-md border border-gray-100">
              <div class="font-medium text-sm text-gray-800">{{ permiso.nombre }}</div>
              <div class="text-xs text-gray-500">{{ permiso.descripcion }}</div>
            </li>
          </ul>
          <Button label="Nuevo Permiso" icon="pi pi-plus" class="p-button-outlined p-button-sm w-full mt-4" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '../../../store/useStore';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';

const store = useStore();

const roles = computed(() => store.state.roles);
const permisos = computed(() => store.state.permisos);
</script>
