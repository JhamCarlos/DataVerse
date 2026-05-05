<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Medidores</h2>
        <p class="text-sm text-gray-500 mt-1">Gestión de medidores de agua y luz por edificio</p>
      </div>
      <Button label="Nuevo Medidor" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Toolbar con Filtros -->
    <Toolbar class="mb-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <template #start>
        <div class="flex gap-4">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar medidor..." class="w-72" />
          </span>
        </div>
      </template>
      <template #end>
        <Button icon="pi pi-file-excel" severity="success" text rounded @click="exportCSV($event)" />
      </template>
    </Toolbar>

    <!-- Data Table PrimeVue -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="medidoresConEdificio" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" filterDisplay="menu" :globalFilterFields="['codigo_medidor', 'tipo_servicio', 'edificio_nombre']"
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron medidores registrados.</div>
        </template>

        <Column field="codigo_medidor" header="Código" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-bold text-gray-800">{{ data.codigo_medidor }}</span>
          </template>
        </Column>

        <Column field="edificio_nombre" header="Edificio" sortable style="min-width: 12rem"></Column>

        <Column field="tipo_servicio" header="Servicio" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :severity="data.tipo_servicio === 'AGUA' ? 'info' : 'warning'" :value="data.tipo_servicio" />
          </template>
        </Column>

        <Column field="es_general" header="Tipo Medidor" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span v-if="data.es_general" class="text-xs bg-purple-100 text-purple-700 px-2 py-1 rounded font-semibold border border-purple-200">
              GENERAL DEL EDIFICIO
            </span>
            <span v-else class="text-xs bg-gray-100 text-gray-600 px-2 py-1 rounded">
              DEPARTAMENTO
            </span>
          </template>
        </Column>

        <Column field="estado" header="Estado" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :severity="data.estado === 1 ? 'success' : 'danger'" :value="data.estado === 1 ? 'Activo' : 'Inactivo'" />
          </template>
        </Column>

        <!-- Acciones CRUD -->
        <Column header="Acciones" :exportable="false" style="min-width: 8rem; text-align: center">
          <template #body="{ data }">
            <div class="flex items-center justify-center gap-2">
              <Button icon="pi pi-pencil" text rounded severity="info" @click="editMedidor(data)" />
              <Button v-if="data.estado === 1" icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(data)" />
              <Button v-else icon="pi pi-refresh" text rounded severity="warning" @click="restoreMedidor(data)" title="Restaurar" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '550px'}" :header="isEditing ? 'Editar Medidor' : 'Nuevo Medidor'" :modal="true" class="p-fluid">
      <FormMedidor 
        :initialData="medidorActual" 
        :isEditing="isEditing" 
        @save="saveMedidor" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar (Soft-Delete) -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Baja" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="medidorActual">¿Estás seguro de que deseas desactivar el medidor <b>{{ medidorActual.codigo_medidor }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Desactivar" icon="pi pi-check" severity="danger" @click="deleteMedidor" />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from '../../../store/useStore';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

import FormMedidor from '../../components/forms/FormMedidor.vue';

const store = useStore();
const toast = useToast();

const medidores = ref([]);
const dt = ref();
const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const medidorActual = ref({});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(() => {
  medidores.value = store.state.medidores;
});

// Computed para mezclar con nombres de edificio si no los tiene guardados por defecto
const medidoresConEdificio = computed(() => {
  return medidores.value.map(m => {
    const e = store.state.edificios.find(edif => edif.id === m.id_edificio);
    return {
      ...m,
      edificio_nombre: e ? e.nombre : 'Desconocido'
    };
  });
});

const openNew = () => {
  medidorActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editMedidor = (medidor) => {
  medidorActual.value = { ...medidor };
  isEditing.value = true;
  formDialog.value = true;
};

const saveMedidor = (data) => {
  if (isEditing.value) {
    const index = medidores.value.findIndex(m => m.id === data.id);
    if (index !== -1) {
      medidores.value[index] = data;
      store.state.medidores = [...medidores.value];
    }
    toast.add({severity:'success', summary: 'Actualizado', detail: 'Medidor actualizado correctamente', life: 3000});
  } else {
    data.id = Math.max(...medidores.value.map(m => m.id), 0) + 1;
    medidores.value.unshift(data);
    store.state.medidores = [...medidores.value];
    toast.add({severity:'success', summary: 'Creado', detail: 'Medidor registrado correctamente', life: 3000});
  }
  formDialog.value = false;
};

const confirmDelete = (medidor) => {
  medidorActual.value = { ...medidor };
  deleteDialog.value = true;
};

const deleteMedidor = () => {
  const index = medidores.value.findIndex(m => m.id === medidorActual.value.id);
  if (index !== -1) {
    medidores.value[index].estado = 0;
    store.state.medidores = [...medidores.value];
  }
  deleteDialog.value = false;
  toast.add({severity:'success', summary: 'Baja Exitosa', detail: 'El medidor ha sido desactivado', life: 3000});
};

const restoreMedidor = (medidor) => {
  const index = medidores.value.findIndex(m => m.id === medidor.id);
  if (index !== -1) {
    medidores.value[index].estado = 1;
    store.state.medidores = [...medidores.value];
  }
  toast.add({severity:'info', summary: 'Restaurado', detail: 'El medidor ha sido activado', life: 3000});
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
