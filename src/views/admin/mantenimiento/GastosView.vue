<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Gastos Operativos</h2>
        <p class="text-sm text-gray-500 mt-1">Control de gastos por mantenimiento y compras operativas</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg mb-4">
      <Toolbar class="bg-transparent border-none p-0">
        <template #start>
          <Button label="Registrar Gasto" icon="pi pi-plus" class="p-button-primary mr-2" @click="openNew" />
        </template>
        <template #end>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar gasto..." />
          </span>
        </template>
      </Toolbar>
    </div>

    <!-- Data Table -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="gastosActivos" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron gastos registrados.</div>
        </template>

        <Column field="edificio_nombre" header="Edificio" style="min-width: 12rem" sortable></Column>

        <Column field="categoria" header="Categoría" style="min-width: 12rem" sortable>
          <template #body="{ data }">
            <span class="text-gray-700 font-medium">{{ data.categoria.replace(/_/g, ' ') }}</span>
          </template>
        </Column>

        <Column field="fecha_gasto" header="Fecha" style="min-width: 10rem" sortable></Column>

        <Column field="monto" header="Monto" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <span class="font-bold text-primary">${{ data.monto.toFixed(2) }}</span>
          </template>
        </Column>

        <Column field="estado_gasto" header="Estado" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <Tag :severity="getSeverity(data.estado_gasto)" :value="data.estado_gasto" />
          </template>
        </Column>

        <Column header="Acciones" style="min-width: 10rem; text-align: center">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info mr-2" @click="editGasto(data)" v-tooltip.top="'Editar'" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteGasto(data)" v-tooltip.top="'Eliminar'" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '650px'}" :header="isEditing ? 'Editar Gasto' : 'Registrar Gasto'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormGasto 
        :initialData="gastoActual" 
        :isEditing="isEditing" 
        @save="saveGasto" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Eliminación" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="gastoActual">¿Estás seguro de que deseas eliminar este gasto de <b>${{ gastoActual.monto?.toFixed(2) }}</b> correspondiente a {{ gastoActual.edificio_nombre }}?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
        <Button label="Sí, Eliminar" icon="pi pi-check" class="p-button-danger" @click="deleteGasto" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from '../../../store/useStore';
import { FilterMatchMode } from '@primevue/core/api';
import { useToast } from 'primevue/usetoast';
import { dialogFormPt, dialogConfirmPt } from '../../../utils/dialogPt';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import InputText from 'primevue/inputtext';
import Dialog from 'primevue/dialog';
import Tag from 'primevue/tag';
import FormGasto from '../../../components/forms/FormGasto.vue';

const store = useStore();
const toast = useToast();

const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const gastoActual = ref({});
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const gastosActivos = computed(() => {
  return store.state.gastos.filter(g => g.estado === 1);
});

const getSeverity = (estado) => {
  switch (estado) {
    case 'APROBADO': return 'success';
    case 'PENDIENTE': return 'warning';
    case 'CANCELADO': return 'danger';
    default: return 'info';
  }
};

const openNew = () => {
  gastoActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editGasto = (gasto) => {
  gastoActual.value = { ...gasto };
  isEditing.value = true;
  formDialog.value = true;
};

const confirmDeleteGasto = (gasto) => {
  gastoActual.value = gasto;
  deleteDialog.value = true;
};

const saveGasto = (gastoData) => {
  if (isEditing.value) {
    const index = store.state.gastos.findIndex(g => g.id === gastoData.id);
    if (index !== -1) {
      store.state.gastos[index] = gastoData;
      toast.add({severity:'success', summary: 'Gasto Actualizado', detail: 'El registro se actualizó correctamente', life: 3000});
    }
  } else {
    const newId = store.state.gastos.length > 0 ? Math.max(...store.state.gastos.map(g => g.id)) + 1 : 1;
    store.state.gastos.push({ ...gastoData, id: newId });
    toast.add({severity:'success', summary: 'Gasto Registrado', detail: 'El gasto se registró correctamente', life: 3000});
  }
  formDialog.value = false;
  gastoActual.value = {};
};

const deleteGasto = () => {
  const index = store.state.gastos.findIndex(g => g.id === gastoActual.value.id);
  if (index !== -1) {
    store.state.gastos[index].estado_gasto = 'CANCELADO';
    store.state.gastos[index].estado = 0; // Soft delete
    toast.add({severity:'success', summary: 'Gasto Eliminado', detail: 'El registro ha sido eliminado', life: 3000});
  }
  deleteDialog.value = false;
  gastoActual.value = {};
};
</script>
