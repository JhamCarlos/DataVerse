<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Departamentos</h2>
        <p class="text-sm text-gray-500 mt-1">Gestión de unidades arrendables por edificio</p>
      </div>
      <Button label="Nuevo Departamento" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Toolbar con Filtros -->
    <Toolbar class="mb-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <template #start>
        <div class="flex gap-4">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar departamento..." class="w-72" />
          </span>
          <Dropdown v-model="filtroEdificio" :options="edificios" optionLabel="nombre" optionValue="id" placeholder="Filtrar por Edificio" showClear @change="aplicarFiltroEdificio" />
        </div>
      </template>
      <template #end>
        <Button icon="pi pi-file-excel" severity="success" text rounded @click="exportCSV($event)" />
      </template>
    </Toolbar>

    <!-- Data Table PrimeVue -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="departamentosFiltrados" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" filterDisplay="menu" :globalFilterFields="['numero_dpto', 'nombre_edificio']"
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron departamentos registrados.</div>
        </template>

        <Column field="nombre_edificio" header="Edificio" sortable style="min-width: 12rem">
          <template #body="{ data }">
            <span class="font-medium text-gray-800">{{ data.nombre_edificio }}</span>
          </template>
        </Column>

        <Column field="numero_dpto" header="Nro. Dpto" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <span class="font-bold text-primary">{{ data.numero_dpto }}</span>
          </template>
        </Column>

        <Column field="piso" header="Piso" sortable style="min-width: 6rem; text-align: center"></Column>

        <Column field="area_m2" header="Área (m²)" sortable style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.area_m2 }} m²
          </template>
        </Column>

        <Column field="estado_ocupacion" header="Ocupación" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <Tag :severity="getOcupacionSeverity(data.estado_ocupacion)" :value="data.estado_ocupacion" />
          </template>
        </Column>

        <Column field="estado" header="Estado Sistema" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :severity="data.estado === 1 ? 'success' : 'danger'" :value="data.estado === 1 ? 'Activo' : 'Inactivo'" />
          </template>
        </Column>

        <!-- Acciones CRUD -->
        <Column header="Acciones" :exportable="false" style="min-width: 8rem; text-align: center">
          <template #body="{ data }">
            <div class="flex items-center justify-center gap-2">
              <Button icon="pi pi-pencil" text rounded severity="info" @click="editDepartamento(data)" />
              <Button v-if="data.estado === 1" icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(data)" />
              <Button v-else icon="pi pi-refresh" text rounded severity="warning" @click="restoreDepartamento(data)" title="Restaurar" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '650px'}" :header="isEditing ? 'Editar Departamento' : 'Nuevo Departamento'" :modal="true" class="p-fluid">
      <FormDepartamento 
        :initialData="deptoActual" 
        :isEditing="isEditing" 
        @save="saveDepartamento" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar (Soft-Delete) -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Baja" :modal="true">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="deptoActual">¿Estás seguro de que deseas desactivar el departamento <b>{{ deptoActual.numero_dpto }}</b> del edificio {{ deptoActual.nombre_edificio }}?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Desactivar" icon="pi pi-check" severity="danger" @click="deleteDepartamento" />
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
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

import FormDepartamento from '../../components/forms/FormDepartamento.vue';

const store = useStore();
const toast = useToast();

const departamentos = ref([]);
const edificios = ref([]);
const dt = ref();
const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const deptoActual = ref({});
const filtroEdificio = ref(null);

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(() => {
  departamentos.value = store.state.departamentos;
  edificios.value = store.state.edificios.filter(e => e.estado === 1); // Solo edificios activos para el filtro
});

const departamentosFiltrados = computed(() => {
  if (filtroEdificio.value) {
    return departamentos.value.filter(d => d.id_edificio === filtroEdificio.value);
  }
  return departamentos.value;
});

const aplicarFiltroEdificio = () => {
  // El filtro ya se maneja por el computed 'departamentosFiltrados'
};

const getOcupacionSeverity = (estado) => {
  switch (estado) {
    case 'DISPONIBLE': return 'success';
    case 'RESERVADO': return 'info';
    case 'OCUPADO': return 'warning';
    case 'MANTENIMIENTO': return 'danger';
    default: return 'secondary';
  }
};

const openNew = () => {
  deptoActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editDepartamento = (depto) => {
  deptoActual.value = { ...depto };
  isEditing.value = true;
  formDialog.value = true;
};

const saveDepartamento = (data) => {
  if (isEditing.value) {
    const index = departamentos.value.findIndex(d => d.id === data.id);
    if (index !== -1) {
      departamentos.value[index] = data;
      store.state.departamentos = [...departamentos.value];
    }
    toast.add({severity:'success', summary: 'Actualizado', detail: 'Departamento actualizado', life: 3000});
  } else {
    data.id = Math.max(...departamentos.value.map(d => d.id), 0) + 1;
    departamentos.value.unshift(data);
    store.state.departamentos = [...departamentos.value];
    toast.add({severity:'success', summary: 'Creado', detail: 'Departamento registrado', life: 3000});
  }
  formDialog.value = false;
};

const confirmDelete = (depto) => {
  if (depto.estado_ocupacion === 'OCUPADO' || depto.estado_ocupacion === 'RESERVADO') {
    toast.add({severity:'error', summary: 'Error', detail: 'No se puede desactivar un departamento ocupado o reservado.', life: 4000});
    return;
  }
  deptoActual.value = { ...depto };
  deleteDialog.value = true;
};

const deleteDepartamento = () => {
  const index = departamentos.value.findIndex(d => d.id === deptoActual.value.id);
  if (index !== -1) {
    departamentos.value[index].estado = 0;
    store.state.departamentos = [...departamentos.value];
  }
  deleteDialog.value = false;
  toast.add({severity:'success', summary: 'Baja Exitosa', detail: 'El departamento ha sido desactivado', life: 3000});
};

const restoreDepartamento = (depto) => {
  const index = departamentos.value.findIndex(d => d.id === depto.id);
  if (index !== -1) {
    departamentos.value[index].estado = 1;
    store.state.departamentos = [...departamentos.value];
  }
  toast.add({severity:'info', summary: 'Restaurado', detail: 'El departamento ha sido activado', life: 3000});
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
