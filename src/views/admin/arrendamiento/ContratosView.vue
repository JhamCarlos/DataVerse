<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Contratos</h2>
        <p class="text-sm text-gray-500 mt-1">Gestión del ciclo de vida de los contratos de arrendamiento</p>
      </div>
      <Button label="Nuevo Contrato" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Toolbar con Filtros -->
    <Toolbar class="mb-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <template #start>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Buscar contrato..." class="w-72" />
        </span>
      </template>
      <template #end>
        <Button icon="pi pi-file-excel" severity="success" text rounded @click="exportCSV($event)" />
      </template>
    </Toolbar>

    <!-- Data Table PrimeVue -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="contratos" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" filterDisplay="menu" :globalFilterFields="['codigo', 'inquilino_nombre', 'departamento_numero']"
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron contratos registrados.</div>
        </template>

        <Column field="codigo" header="Código" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-bold text-gray-800">{{ data.codigo }}</span>
          </template>
        </Column>

        <Column field="inquilino_nombre" header="Inquilino" sortable style="min-width: 14rem"></Column>
        <Column field="departamento_numero" header="Departamento" sortable style="min-width: 14rem"></Column>

        <Column field="fechas" header="Vigencia" style="min-width: 12rem">
          <template #body="{ data }">
            <div class="text-xs text-gray-600">
              <span class="font-semibold text-gray-800">Inicio:</span> {{ data.fecha_inicio }}<br/>
              <span class="font-semibold text-gray-800">Fin:</span> {{ data.fecha_fin }}
            </div>
          </template>
        </Column>

        <Column field="monto_alquiler" header="Renta" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <span class="font-bold text-green-700">${{ data.monto_alquiler }}</span>
          </template>
        </Column>

        <Column field="estado_contrato" header="Estado" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :severity="getEstadoSeverity(data.estado_contrato)" :value="data.estado_contrato" />
          </template>
        </Column>

        <!-- Acciones CRUD -->
        <Column header="Acciones" :exportable="false" style="min-width: 10rem; text-align: center">
          <template #body="{ data }">
            <div class="flex items-center justify-center gap-2">
              <Button v-if="data.estado_contrato === 'BORRADOR' || data.estado_contrato === 'ACTIVO'" icon="pi pi-pencil" text rounded severity="info" @click="editContrato(data)" title="Editar" />
              <Button v-if="data.estado_contrato === 'ACTIVO'" icon="pi pi-check-circle" text rounded severity="success" @click="confirmFinalizar(data)" title="Finalizar Contrato" />
              <Button v-if="data.estado_contrato === 'ACTIVO' || data.estado_contrato === 'BORRADOR'" icon="pi pi-ban" text rounded severity="danger" @click="confirmAnular(data)" title="Anular Contrato" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '750px'}" :header="isEditing ? 'Editar Contrato' : 'Nuevo Contrato'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormContrato 
        :initialData="contratoActual" 
        :isEditing="isEditing" 
        @save="saveContrato" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Finalizar -->
    <Dialog v-model:visible="finalizarDialog" :style="{width: '450px'}" header="Confirmar Finalización" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-info-circle text-blue-500 text-4xl" />
        <span v-if="contratoActual">¿Confirmas que el contrato <b>{{ contratoActual.codigo }}</b> ha concluido de forma regular?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="finalizarDialog = false"/>
        <Button label="Finalizar Contrato" icon="pi pi-check" severity="success" @click="finalizarContrato" />
      </template>
    </Dialog>

    <!-- Modal Confirmación Anular -->
    <Dialog v-model:visible="anularDialog" :style="{width: '450px'}" header="Confirmar Anulación" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="contratoActual">¿Estás seguro de que deseas ANULAR el contrato <b>{{ contratoActual.codigo }}</b>? Esta acción liberará el departamento.</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="anularDialog = false"/>
        <Button label="Anular Contrato" icon="pi pi-ban" severity="danger" @click="anularContrato" />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
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

import FormContrato from '../../../components/forms/FormContrato.vue';

const store = useStore();
const toast = useToast();

// Usar computed para siempre obtener datos actualizados del store
const contratos = computed(() => store.state.contratos.filter(c => c.estado === 1));

const dt = ref();
const formDialog = ref(false);
const finalizarDialog = ref(false);
const anularDialog = ref(false);
const isEditing = ref(false);
const contratoActual = ref({});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const getEstadoSeverity = (estado) => {
  switch(estado) {
    case 'BORRADOR': return 'secondary';
    case 'ACTIVO': return 'success';
    case 'FINALIZADO': return 'info';
    case 'ANULADO': return 'danger';
    default: return 'warning';
  }
};

const openNew = () => {
  contratoActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editContrato = (contrato) => {
  contratoActual.value = { ...contrato };
  isEditing.value = true;
  formDialog.value = true;
};

const saveContrato = (data) => {
  if (isEditing.value) {
    const index = store.state.contratos.findIndex(c => c.id === data.id);
    if (index !== -1) {
      store.state.contratos[index] = data;
    }
    toast.add({severity:'success', summary: 'Actualizado', detail: 'Contrato modificado', life: 3000});
  } else {
    data.id = Math.max(...store.state.contratos.map(c => c.id), 0) + 1;
    store.state.contratos.unshift(data);
    toast.add({severity:'success', summary: 'Generado', detail: 'Contrato registrado', life: 3000});
  }
  formDialog.value = false;
};

const confirmFinalizar = (contrato) => {
  contratoActual.value = { ...contrato };
  finalizarDialog.value = true;
};

const finalizarContrato = () => {
  const index = store.state.contratos.findIndex(c => c.id === contratoActual.value.id);
  if (index !== -1) {
    store.state.contratos[index].estado_contrato = 'FINALIZADO';
  }
  finalizarDialog.value = false;
  toast.add({severity:'success', summary: 'Contrato Finalizado', detail: 'El contrato concluyó exitosamente', life: 3000});
};

const confirmAnular = (contrato) => {
  contratoActual.value = { ...contrato };
  anularDialog.value = true;
};

const anularContrato = () => {
  const index = store.state.contratos.findIndex(c => c.id === contratoActual.value.id);
  if (index !== -1) {
    store.state.contratos[index].estado_contrato = 'ANULADO';
    
    // Simulación del Trigger de la BD: Liberar el departamento
    const idDepto = store.state.contratos[index].id_departamento;
    const iDepto = store.state.departamentos.findIndex(d => d.id === idDepto);
    if(iDepto !== -1) {
      store.state.departamentos[iDepto].estado_ocupacion = 'DISPONIBLE';
    }
  }
  anularDialog.value = false;
  toast.add({severity:'warn', summary: 'Contrato Anulado', detail: 'El departamento ha sido liberado', life: 4000});
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
