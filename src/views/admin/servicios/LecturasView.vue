<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Lecturas de Medidores</h2>
        <p class="text-sm text-gray-500 mt-1">Registro de consumo mensual por medidor</p>
      </div>
      <Button label="Registrar Lectura" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Toolbar con Filtros -->
    <Toolbar class="mb-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <template #start>
        <div class="flex gap-4">
          <span class="p-input-icon-left">
            <i class="pi pi-search" />
            <InputText v-model="filters['global'].value" placeholder="Buscar por medidor..." class="w-72" />
          </span>
          <InputText v-model="filtroPeriodo" placeholder="Periodo (Ej. 2024-04)" class="w-48" />
        </div>
      </template>
      <template #end>
        <Button icon="pi pi-file-excel" severity="success" text rounded @click="exportCSV($event)" />
      </template>
    </Toolbar>

    <!-- Data Table PrimeVue -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="lecturasFiltradas" dataKey="id" :paginator="true" :rows="10" 
                 :filters="filters" filterDisplay="menu" :globalFilterFields="['medidor_codigo', 'periodo']"
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron lecturas registradas.</div>
        </template>

        <Column field="medidor_codigo" header="Medidor" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-bold text-gray-800">{{ data.medidor_codigo }}</span>
          </template>
        </Column>

        <Column field="periodo" header="Periodo" sortable style="min-width: 8rem"></Column>

        <Column field="lectura_anterior" header="L. Anterior" sortable style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.lectura_anterior.toFixed(2) }}
          </template>
        </Column>

        <Column field="lectura_actual" header="L. Actual" sortable style="min-width: 8rem">
          <template #body="{ data }">
            {{ data.lectura_actual.toFixed(2) }}
          </template>
        </Column>

        <Column field="consumo" header="Consumo Calculado" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-bold text-blue-700">{{ data.consumo.toFixed(2) }}</span>
          </template>
        </Column>

        <Column field="estado" header="Estado" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :severity="data.estado === 1 ? 'success' : 'danger'" :value="data.estado === 1 ? 'Válida' : 'Anulada'" />
          </template>
        </Column>

        <!-- Acciones CRUD -->
        <Column header="Acciones" :exportable="false" style="min-width: 8rem; text-align: center">
          <template #body="{ data }">
            <div class="flex items-center justify-center gap-2">
              <Button icon="pi pi-pencil" text rounded severity="info" @click="editLectura(data)" />
              <Button v-if="data.estado === 1" icon="pi pi-ban" text rounded severity="danger" @click="confirmDelete(data)" title="Anular Lectura" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '550px'}" :header="isEditing ? 'Editar Lectura' : 'Nueva Lectura'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormLectura 
        :initialData="lecturaActual" 
        :isEditing="isEditing" 
        @save="saveLectura" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Anulación" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="lecturaActual">¿Deseas anular la lectura del medidor <b>{{ lecturaActual.medidor_codigo }}</b> para el periodo {{ lecturaActual.periodo }}?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Sí, Anular" icon="pi pi-check" severity="danger" @click="deleteLectura" />
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
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

import FormLectura from '../../../components/forms/FormLectura.vue';

const store = useStore();
const toast = useToast();

const lecturas = ref([]);
const dt = ref();
const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const lecturaActual = ref({});
const filtroPeriodo = ref('');

const filters = ref({
    global: { value: null, matchMode: FilterMatchMode.CONTAINS },
});

onMounted(() => {
  lecturas.value = store.state.lecturas;
});

const lecturasFiltradas = computed(() => {
  if (!filtroPeriodo.value) return lecturas.value;
  return lecturas.value.filter(l => l.periodo.includes(filtroPeriodo.value));
});

const openNew = () => {
  lecturaActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editLectura = (lectura) => {
  lecturaActual.value = { ...lectura };
  isEditing.value = true;
  formDialog.value = true;
};

const saveLectura = (data) => {
  if (isEditing.value) {
    const index = lecturas.value.findIndex(l => l.id === data.id);
    if (index !== -1) {
      lecturas.value[index] = data;
      store.state.lecturas = [...lecturas.value];
    }
    toast.add({severity:'success', summary: 'Actualizado', detail: 'Lectura actualizada', life: 3000});
  } else {
    data.id = Math.max(...lecturas.value.map(l => l.id), 0) + 1;
    lecturas.value.unshift(data);
    store.state.lecturas = [...lecturas.value];
    toast.add({severity:'success', summary: 'Registrado', detail: 'Lectura guardada', life: 3000});
  }
  formDialog.value = false;
};

const confirmDelete = (lectura) => {
  lecturaActual.value = { ...lectura };
  deleteDialog.value = true;
};

const deleteLectura = () => {
  const index = lecturas.value.findIndex(l => l.id === lecturaActual.value.id);
  if (index !== -1) {
    lecturas.value[index].estado = 0;
    store.state.lecturas = [...lecturas.value];
  }
  deleteDialog.value = false;
  toast.add({severity:'success', summary: 'Anulación', detail: 'La lectura fue anulada', life: 3000});
};

const exportCSV = () => {
  dt.value.exportCSV();
};
</script>
