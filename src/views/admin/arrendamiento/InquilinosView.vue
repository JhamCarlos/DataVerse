<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Inquilinos</h2>
        <p class="text-sm text-gray-500 mt-1">Gestión del perfil de inquilinos</p>
      </div>
      <Button label="Nuevo Inquilino" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Toolbar con Filtros -->
    <Toolbar class="mb-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <template #start>
        <span class="p-input-icon-left">
          <i class="pi pi-search" />
          <InputText v-model="filters['global'].value" placeholder="Buscar inquilino..." class="w-72" />
        </span>
      </template>
      <template #end>
        <Button icon="pi pi-file-excel" severity="success" text rounded @click="exportCSV($event)" />
      </template>
    </Toolbar>

    <!-- Data Table PrimeVue -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="inquilinos" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" filterDisplay="menu" :globalFilterFields="['nombres', 'apellido_paterno', 'numero_documento', 'correo']"
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron inquilinos registrados.</div>
        </template>

        <Column field="numero_documento" header="Documento" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="text-gray-500 text-xs">{{ data.tipo_documento }}</span><br/>
            <span class="font-bold text-gray-800">{{ data.numero_documento }}</span>
          </template>
        </Column>

        <Column field="nombres" header="Nombres y Apellidos" sortable style="min-width: 16rem">
          <template #body="{ data }">
            {{ data.nombres }} {{ data.apellido_paterno }} {{ data.apellido_materno }}
          </template>
        </Column>

        <Column field="contacto" header="Contacto" style="min-width: 14rem">
          <template #body="{ data }">
            <div class="flex flex-col gap-1">
              <span class="text-sm"><i class="pi pi-phone text-xs mr-1 text-gray-400"></i>{{ data.telefono }}</span>
              <span class="text-sm text-gray-500"><i class="pi pi-envelope text-xs mr-1 text-gray-400"></i>{{ data.correo }}</span>
            </div>
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
              <Button icon="pi pi-pencil" text rounded severity="info" @click="editInquilino(data)" />
              <Button v-if="data.estado === 1" icon="pi pi-trash" text rounded severity="danger" @click="confirmDelete(data)" />
              <Button v-else icon="pi pi-refresh" text rounded severity="warning" @click="restoreInquilino(data)" title="Restaurar" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '650px'}" :header="isEditing ? 'Editar Inquilino' : 'Nuevo Inquilino'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormInquilino 
        :initialData="inquilinoActual" 
        :isEditing="isEditing" 
        @save="saveInquilino" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Baja" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="inquilinoActual">¿Estás seguro de que deseas desactivar a <b>{{ inquilinoActual.nombres }} {{ inquilinoActual.apellido_paterno }}</b>?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Desactivar" icon="pi pi-check" severity="danger" @click="deleteInquilino" />
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

import FormInquilino from '../../../components/forms/FormInquilino.vue';

const store = useStore();
const toast = useToast();

// Usar computed para siempre obtener datos actualizados del store
const inquilinos = computed(() => store.state.inquilinos);

const dt = ref();
const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const inquilinoActual = ref({});

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

const openNew = () => {
  inquilinoActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editInquilino = (inquilino) => {
  inquilinoActual.value = { ...inquilino };
  isEditing.value = true;
  formDialog.value = true;
};

const saveInquilino = (data) => {
  if (isEditing.value) {
    const index = store.state.inquilinos.findIndex(i => i.id === data.id);
    if (index !== -1) {
      store.state.inquilinos[index] = data;
    }
    toast.add({severity:'success', summary: 'Actualizado', detail: 'Inquilino actualizado', life: 3000});
  } else {
    data.id = Math.max(...store.state.inquilinos.map(i => i.id), 0) + 1;
    store.state.inquilinos.unshift(data);
    toast.add({severity:'success', summary: 'Creado', detail: 'Inquilino registrado', life: 3000});
  }
  formDialog.value = false;
};

const confirmDelete = (inquilino) => {
  // Validar si tiene contratos activos (simulado)
  const tieneContratoActivo = store.state.contratos.some(c => c.id_inquilino === inquilino.id && c.estado_contrato === 'ACTIVO');
  if (tieneContratoActivo) {
    toast.add({severity:'error', summary: 'Error', detail: 'El inquilino tiene contratos activos y no puede ser dado de baja.', life: 4000});
    return;
  }
  inquilinoActual.value = { ...inquilino };
  deleteDialog.value = true;
};

const deleteInquilino = () => {
  const index = store.state.inquilinos.findIndex(i => i.id === inquilinoActual.value.id);
  if (index !== -1) {
    store.state.inquilinos[index].estado = 0;
  }
  deleteDialog.value = false;
  toast.add({severity:'success', summary: 'Baja Exitosa', detail: 'El inquilino ha sido desactivado', life: 3000});
};

const restoreInquilino = (inquilino) => {
  const index = store.state.inquilinos.findIndex(i => i.id === inquilino.id);
  if (index !== -1) {
    store.state.inquilinos[index].estado = 1;
  }
  toast.add({severity:'info', summary: 'Restaurado', detail: 'El inquilino ha sido activado', life: 3000});
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
