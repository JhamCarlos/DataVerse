<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Edificios</h2>
        <p class="text-sm text-gray-500 mt-1">Gestión de todos los inmuebles administrados</p>
      </div>
      <Button label="Nuevo Edificio" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Toolbar con Filtros y Acciones globales (opcional) -->
    <Toolbar class="mb-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <template #start>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Buscar edificio..." class="w-72" />
        </span>
      </template>
      <template #end>
        <Button icon="pi pi-file-excel" severity="success" text rounded aria-label="Exportar CSV" @click="exportCSV($event)" />
      </template>
    </Toolbar>

    <!-- Data Table PrimeVue -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" v-model:expandedRows="expandedRows" :value="edificios" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" filterDisplay="menu" :globalFilterFields="['nombre', 'direccion', 'distrito']"
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron edificios registrados.</div>
        </template>

        <Column expander style="width: 3rem" />

        <Column field="nombre" header="Nombre" sortable style="min-width: 14rem">
          <template #body="{ data }">
            <span class="font-semibold text-gray-800">{{ data.nombre }}</span>
          </template>
        </Column>

        <Column field="direccion" header="Dirección" sortable style="min-width: 16rem">
          <template #body="{ data }">
            {{ data.direccion }}, {{ data.distrito }}
          </template>
        </Column>

        <Column field="telefono_contacto" header="Contacto" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="text-gray-600 text-sm">{{ data.telefono_contacto || 'N/A' }}</span>
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
              <Button icon="pi pi-pencil" text rounded severity="info" @click="editEdificio(data)" />
              <Button v-if="data.estado === 1" icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(data)" />
              <Button v-else icon="pi pi-refresh" text rounded severity="warning" @click="restoreEdificio(data)" title="Restaurar" />
            </div>
          </template>
        </Column>

        <!-- Master-Detail Expansion -->
        <template #expansion="slotProps">
          <div class="p-4 bg-gray-50 rounded-lg border border-gray-200 ml-10 my-2">
            <h5 class="text-md font-bold mb-3 text-gray-800">Departamentos del {{ slotProps.data.nombre }}</h5>
            <DataTable :value="getDepartamentosByEdificio(slotProps.data.id)" class="p-datatable-sm shadow-sm" responsiveLayout="scroll">
              <template #empty>
                <div class="text-gray-500 py-3 text-sm">No hay departamentos registrados para este edificio.</div>
              </template>
              <Column field="numero_dpto" header="N° Dpto" />
              <Column field="piso" header="Piso" />
              <Column field="area_m2" header="Área (m²)" />
              <Column field="num_habitaciones" header="Habitaciones" />
              <Column field="estado_ocupacion" header="Ocupación">
                <template #body="{ data }">
                  <Tag :severity="getOcupacionSeverity(data.estado_ocupacion)" :value="data.estado_ocupacion" />
                </template>
              </Column>
            </DataTable>
          </div>
        </template>

      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '600px'}" :header="isEditing ? 'Editar Edificio' : 'Nuevo Edificio'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormEdificio 
        :initialData="edificioActual" 
        :isEditing="isEditing" 
        @save="saveEdificio" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar (Soft-Delete) -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Baja" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="edificioActual">¿Estás seguro de que deseas desactivar el edificio <b>{{ edificioActual.nombre }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Desactivar" icon="pi pi-check" severity="danger" @click="deleteEdificio" />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '../../../store/useStore';
import { FilterMatchMode } from '@primevue/core/api';
import { dialogFormPt, dialogConfirmPt } from '../../../utils/dialogPt';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

import FormEdificio from '../../../components/forms/FormEdificio.vue';

const store = useStore();
const toast = useToast();

const edificios = ref([]);
const dt = ref();
const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const edificioActual = ref({});
const expandedRows = ref({});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const getDepartamentosByEdificio = (idEdificio) => {
  return store.state.departamentos.filter(d => d.id_edificio === idEdificio && d.estado === 1);
};

const getOcupacionSeverity = (estado) => {
  return estado === 'DISPONIBLE' ? 'success' : 'danger';
};

onMounted(() => {
  // Simular fetch de base de datos
  edificios.value = store.state.edificios;
});

const openNew = () => {
  edificioActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editEdificio = (edificio) => {
  edificioActual.value = { ...edificio };
  isEditing.value = true;
  formDialog.value = true;
};

const saveEdificio = (data) => {
  if (isEditing.value) {
    // Editar en local
    const index = edificios.value.findIndex(e => e.id === data.id);
    if (index !== -1) {
      edificios.value[index] = data;
      // Actualizar store (simulado)
      store.state.edificios = [...edificios.value];
    }
    toast.add({severity:'success', summary: 'Actualizado', detail: 'Edificio actualizado correctamente', life: 3000});
  } else {
    // Crear en local simulando ID
    data.id = Math.max(...edificios.value.map(e => e.id), 0) + 1;
    edificios.value.unshift(data);
    store.state.edificios = [...edificios.value];
    toast.add({severity:'success', summary: 'Creado', detail: 'Edificio registrado correctamente', life: 3000});
  }
  formDialog.value = false;
};

const confirmDelete = (edificio) => {
  edificioActual.value = { ...edificio };
  deleteDialog.value = true;
};

const deleteEdificio = () => {
  // Soft Delete
  const index = edificios.value.findIndex(e => e.id === edificioActual.value.id);
  if (index !== -1) {
    edificios.value[index].estado = 0;
    store.state.edificios = [...edificios.value];
  }
  deleteDialog.value = false;
  toast.add({severity:'success', summary: 'Baja Exitosa', detail: 'El edificio ha sido desactivado', life: 3000});
};

const restoreEdificio = (edificio) => {
  const index = edificios.value.findIndex(e => e.id === edificio.id);
  if (index !== -1) {
    edificios.value[index].estado = 1;
    store.state.edificios = [...edificios.value];
  }
  toast.add({severity:'info', summary: 'Restaurado', detail: 'El edificio ha sido activado nuevamente', life: 3000});
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
