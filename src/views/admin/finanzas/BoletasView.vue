<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Gestión de Boletas</h2>
        <p class="text-sm text-gray-500 mt-1">Control de emisiones y cobros a inquilinos</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg mb-4">
      <Toolbar class="bg-transparent border-none p-0">
        <template #start>
          <Button label="Generar Boleta" icon="pi pi-plus" class="p-button-primary mr-2" @click="openNew" />
        </template>
        <template #end>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar boleta..." />
          </span>
        </template>
      </Toolbar>
    </div>

    <!-- Data Table -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="boletasActivas" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron boletas.</div>
        </template>

        <Column field="contrato_codigo" header="Contrato" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <span class="font-bold text-gray-800">{{ data.contrato_codigo }}</span>
          </template>
        </Column>

        <Column field="periodo" header="Periodo" style="min-width: 8rem" sortable></Column>

        <Column field="fecha_emision" header="Emisión" style="min-width: 10rem" sortable></Column>

        <Column field="monto_total" header="Total" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <span class="font-bold text-primary">${{ data.monto_total.toFixed(2) }}</span>
          </template>
        </Column>

        <Column field="estado_boleta" header="Estado" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <Tag :severity="getSeverity(data.estado_boleta)" :value="data.estado_boleta" />
          </template>
        </Column>

        <Column header="Acciones" style="min-width: 10rem; text-align: center">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info mr-2" @click="editBoleta(data)" v-tooltip.top="'Editar'" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeleteBoleta(data)" v-tooltip.top="'Anular'" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '750px'}" :header="isEditing ? 'Editar Boleta' : 'Generar Boleta'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormBoleta 
        :initialData="boletaActual" 
        :isEditing="isEditing" 
        @save="saveBoleta" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Anulación" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="boletaActual">¿Estás seguro de que deseas anular la boleta del periodo <b>{{ boletaActual.periodo }}</b> para el contrato {{ boletaActual.contrato_codigo }}?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
        <Button label="Sí, Anular" icon="pi pi-check" class="p-button-danger" @click="deleteBoleta" />
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
import FormBoleta from '../../../components/forms/FormBoleta.vue';

const store = useStore();
const toast = useToast();

const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const boletaActual = ref({});
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const boletasActivas = computed(() => {
  return store.state.boletas.filter(b => b.estado === 1);
});

const getSeverity = (estado) => {
  switch (estado) {
    case 'PAGADA': return 'success';
    case 'PENDIENTE': return 'warning';
    case 'VENCIDA': return 'danger';
    case 'ANULADA': return 'info';
    default: return 'info';
  }
};

const openNew = () => {
  boletaActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editBoleta = (boleta) => {
  boletaActual.value = { ...boleta };
  isEditing.value = true;
  formDialog.value = true;
};

const confirmDeleteBoleta = (boleta) => {
  boletaActual.value = boleta;
  deleteDialog.value = true;
};

const saveBoleta = (boletaData) => {
  if (isEditing.value) {
    const index = store.state.boletas.findIndex(b => b.id === boletaData.id);
    if (index !== -1) {
      store.state.boletas[index] = boletaData;
      toast.add({severity:'success', summary: 'Boleta Actualizada', detail: 'La boleta se actualizó correctamente', life: 3000});
    }
  } else {
    const newId = store.state.boletas.length > 0 ? Math.max(...store.state.boletas.map(b => b.id)) + 1 : 1;
    store.state.boletas.push({ ...boletaData, id: newId });
    toast.add({severity:'success', summary: 'Boleta Generada', detail: 'La boleta se generó correctamente', life: 3000});
  }
  formDialog.value = false;
  boletaActual.value = {};
};

const deleteBoleta = () => {
  const index = store.state.boletas.findIndex(b => b.id === boletaActual.value.id);
  if (index !== -1) {
    store.state.boletas[index].estado_boleta = 'ANULADA'; // Solo anulación lógica de estado
    store.state.boletas[index].estado = 0; // Desactivar
    toast.add({severity:'success', summary: 'Boleta Anulada', detail: 'Boleta eliminada del listado', life: 3000});
  }
  deleteDialog.value = false;
  boletaActual.value = {};
};
</script>
