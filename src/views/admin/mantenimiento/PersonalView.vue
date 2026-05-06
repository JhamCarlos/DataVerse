<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Personal Técnico</h2>
        <p class="text-sm text-gray-500 mt-1">Gestión de personal de mantenimiento y servicios</p>
      </div>
    </div>

    <!-- Toolbar -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg mb-4">
      <Toolbar class="bg-transparent border-none p-0">
        <template #start>
          <Button label="Registrar Personal" icon="pi pi-plus" class="p-button-primary mr-2" @click="openNew" />
        </template>
        <template #end>
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar personal..." />
          </span>
        </template>
      </Toolbar>
    </div>

    <!-- Data Table -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="personalActivo" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontró personal registrado.</div>
        </template>

        <Column field="numero_documento" header="Documento" style="min-width: 10rem" sortable>
          <template #body="{ data }">
            <span class="text-gray-600">{{ data.tipo_documento }}</span> <span class="font-bold text-gray-800">{{ data.numero_documento }}</span>
          </template>
        </Column>

        <Column field="nombres_completos" header="Nombres y Apellidos" style="min-width: 14rem" sortable>
          <template #body="{ data }">
            {{ data.nombres }} {{ data.apellido_paterno }}
          </template>
        </Column>

        <Column field="especialidad" header="Especialidad" style="min-width: 12rem" sortable>
          <template #body="{ data }">
            <Tag severity="info" :value="data.especialidad" />
          </template>
        </Column>

        <Column header="Acciones" style="min-width: 10rem; text-align: center">
          <template #body="{ data }">
            <Button icon="pi pi-pencil" class="p-button-rounded p-button-text p-button-info mr-2" @click="editPersonal(data)" v-tooltip.top="'Editar'" />
            <Button icon="pi pi-trash" class="p-button-rounded p-button-text p-button-danger" @click="confirmDeletePersonal(data)" v-tooltip.top="'Dar de Baja'" />
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '550px'}" :header="isEditing ? 'Editar Personal' : 'Registrar Personal'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormPersonal 
        :initialData="personalActual" 
        :isEditing="isEditing" 
        @save="savePersonal" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación Eliminar -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Baja" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="personalActual">¿Estás seguro de que deseas dar de baja a <b>{{ personalActual.nombres }} {{ personalActual.apellido_paterno }}</b>?</span>
      </div>
      <template #footer>
        <Button label="No" icon="pi pi-times" class="p-button-text" @click="deleteDialog = false" />
        <Button label="Sí, Dar de Baja" icon="pi pi-check" class="p-button-danger" @click="deletePersonal" />
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
import FormPersonal from '../../../components/forms/FormPersonal.vue';

const store = useStore();
const toast = useToast();

const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const personalActual = ref({});
const filters = ref({
  'global': { value: null, matchMode: FilterMatchMode.CONTAINS }
});

const personalActivo = computed(() => {
  return store.state.personal.filter(p => p.estado === 1);
});

const openNew = () => {
  personalActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editPersonal = (personal) => {
  personalActual.value = { ...personal };
  isEditing.value = true;
  formDialog.value = true;
};

const confirmDeletePersonal = (personal) => {
  personalActual.value = personal;
  deleteDialog.value = true;
};

const savePersonal = (personalData) => {
  if (isEditing.value) {
    const index = store.state.personal.findIndex(p => p.id === personalData.id);
    if (index !== -1) {
      store.state.personal[index] = personalData;
      toast.add({severity:'success', summary: 'Personal Actualizado', detail: 'Datos actualizados correctamente', life: 3000});
    }
  } else {
    const newId = store.state.personal.length > 0 ? Math.max(...store.state.personal.map(p => p.id)) + 1 : 1;
    store.state.personal.push({ ...personalData, id: newId });
    toast.add({severity:'success', summary: 'Personal Registrado', detail: 'El personal se registró correctamente', life: 3000});
  }
  formDialog.value = false;
  personalActual.value = {};
};

const deletePersonal = () => {
  const index = store.state.personal.findIndex(p => p.id === personalActual.value.id);
  if (index !== -1) {
    store.state.personal[index].estado = 0; // Soft delete
    toast.add({severity:'success', summary: 'Personal de Baja', detail: 'El registro ha sido ocultado', life: 3000});
  }
  deleteDialog.value = false;
  personalActual.value = {};
};
</script>
