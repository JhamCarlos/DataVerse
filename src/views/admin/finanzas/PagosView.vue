<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Registro de Pagos</h2>
        <p class="text-sm text-gray-500 mt-1">Control de pagos recibidos de inquilinos</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg mb-4">
      <Toolbar class="bg-transparent border-none p-0">
        <template #start>
          <Button label="Registrar Pago" icon="pi pi-plus" class="p-button-primary mr-2" @click="openNew" />
        </template>
        <template #end>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar pago..." />
          </span>
        </template>
      </Toolbar>
    </div>

    <!-- Data Table -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="pagosActivos" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron pagos registrados.</div>
        </template>

        <Column field="boleta_periodo" header="Boleta / Período" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <span class="font-bold text-gray-800">{{ getBoletaDisplay(data) }}</span>
          </template>
        </Column>

        <Column field="fecha_pago" header="Fecha de Pago" style="min-width: 12rem" sortable></Column>

        <Column field="monto_pagado" header="Monto" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <span class="font-bold text-primary">${{ data.monto_pagado.toFixed(2) }}</span>
          </template>
        </Column>
        
        <Column field="id_tipo_pago" header="Método" style="min-width: 10rem" sortable></Column>

        <Column field="estado_validacion" header="Validación" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <Tag :severity="getSeverity(data.estado_validacion)" :value="data.estado_validacion" />
          </template>
        </Column>

        <Column header="Acciones" style="min-width: 10rem; text-align: center">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info mr-2" @click="editPago(data)" v-tooltip.top="'Editar'" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeletePago(data)" v-tooltip.top="'Eliminar'" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '650px'}" :header="isEditing ? 'Editar Pago' : 'Registrar Pago'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormPago 
        :initialData="pagoActual" 
        :isEditing="isEditing" 
        @save="savePago" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Eliminación" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="pagoActual">¿Estás seguro de que deseas anular el pago de la boleta <b>{{ getBoletaDisplay(pagoActual) }}</b>? Esto reversará el estado de la boleta.</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
        <Button label="Sí, Anular Pago" icon="pi pi-check" class="p-button-danger" @click="deletePago" />
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
import FormPago from '../../../components/forms/FormPago.vue';

const store = useStore();
const toast = useToast();

const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const pagoActual = ref({});
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const pagosActivos = computed(() => {
  return store.state.pagos.filter(p => p.estado === 1);
});

const getBoletaDisplay = (pago) => {
  if (pago.contrato_codigo) {
    return `${pago.contrato_codigo} (${pago.boleta_periodo})`;
  }
  // Fallback lookup
  const b = store.state.boletas.find(x => x.id === pago.id_boleta);
  return b ? `${b.contrato_codigo} (${b.periodo})` : pago.boleta_periodo;
};

const getSeverity = (estado) => {
  switch (estado) {
    case 'APROBADO': return 'success';
    case 'PENDIENTE': return 'warn';
    case 'RECHAZADO': return 'danger';
    default: return 'info';
  }
};

const openNew = () => {
  pagoActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editPago = (pago) => {
  pagoActual.value = { ...pago };
  isEditing.value = true;
  formDialog.value = true;
};

const confirmDeletePago = (pago) => {
  pagoActual.value = pago;
  deleteDialog.value = true;
};

const updateBoletaStatus = (id_boleta, estado_pago, isDeleting = false) => {
  const bIndex = store.state.boletas.findIndex(b => b.id === id_boleta);
  if (bIndex !== -1) {
    if (isDeleting || estado_pago === 'RECHAZADO') {
      store.state.boletas[bIndex].estado_boleta = 'PENDIENTE';
    } else if (estado_pago === 'APROBADO') {
      store.state.boletas[bIndex].estado_boleta = 'PAGADA';
    }
  }
};

const savePago = (pagoData) => {
  if (isEditing.value) {
    const index = store.state.pagos.findIndex(p => p.id === pagoData.id);
    if (index !== -1) {
      store.state.pagos[index] = pagoData;
      updateBoletaStatus(pagoData.id_boleta, pagoData.estado_validacion);
      toast.add({severity:'success', summary: 'Pago Actualizado', detail: 'El pago se actualizó correctamente', life: 3000});
    }
  } else {
    const newId = store.state.pagos.length > 0 ? Math.max(...store.state.pagos.map(p => p.id)) + 1 : 1;
    store.state.pagos.push({ ...pagoData, id: newId });
    updateBoletaStatus(pagoData.id_boleta, pagoData.estado_validacion);
    toast.add({severity:'success', summary: 'Pago Registrado', detail: 'El pago se registró correctamente', life: 3000});
  }
  formDialog.value = false;
  pagoActual.value = {};
};

const deletePago = () => {
  const index = store.state.pagos.findIndex(p => p.id === pagoActual.value.id);
  if (index !== -1) {
    const pago = store.state.pagos[index];
    pago.estado_validacion = 'RECHAZADO';
    pago.estado = 0; // Desactivar lógica
    updateBoletaStatus(pago.id_boleta, 'RECHAZADO', true);
    toast.add({severity:'success', summary: 'Pago Anulado', detail: 'Pago anulado y boleta reversada a pendiente', life: 3000});
  }
  deleteDialog.value = false;
  pagoActual.value = {};
};
</script>
