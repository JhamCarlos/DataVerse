<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Tarifas de Servicios</h2>
        <p class="text-sm text-gray-500 mt-1">Gestión de costos por unidad para el cálculo de boletas</p>
      </div>
      <Button label="Nueva Tarifa" icon="pi pi-plus" @click="openNew" />
    </div>

    <!-- Toolbar con Filtros -->
    <Toolbar class="mb-4 bg-white border border-gray-200 shadow-sm rounded-lg">
      <template #start>
        <div class="flex gap-4">
          <Dropdown v-model="filtroEdificio" :options="edificios" optionLabel="nombre" optionValue="id" placeholder="Filtrar por Edificio" showClear />
          <Dropdown v-model="filtroServicio" :options="tiposServicio" placeholder="Tipo Servicio" showClear />
        </div>
      </template>
    </Toolbar>

    <!-- Data Table PrimeVue -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="tarifasFiltradas" dataKey="id" :paginator="true" :rows="10" 
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No se encontraron tarifas registradas.</div>
        </template>

        <Column field="edificio_nombre" header="Edificio" sortable style="min-width: 14rem"></Column>

        <Column field="tipo_servicio" header="Servicio" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <Tag :severity="data.tipo_servicio === 'AGUA' ? 'info' : 'warning'" :value="data.tipo_servicio" />
          </template>
        </Column>

        <Column field="precio_unitario" header="Costo Unitario" sortable style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-bold text-gray-800">${{ data.precio_unitario }}</span> / {{ data.unidad }}
          </template>
        </Column>

        <Column field="fecha_vigencia_desde" header="Vigencia Desde" sortable style="min-width: 12rem"></Column>

        <Column field="estado" header="Estado" sortable style="min-width: 8rem">
          <template #body="{ data }">
            <Tag :severity="data.estado === 1 ? 'success' : 'danger'" :value="data.estado === 1 ? 'Vigente' : 'Histórico'" />
          </template>
        </Column>

        <!-- Acciones CRUD -->
        <Column header="Acciones" :exportable="false" style="min-width: 8rem; text-align: center">
          <template #body="{ data }">
            <div class="flex items-center justify-center gap-2">
              <Button icon="pi pi-pencil" text rounded severity="info" @click="editTarifa(data)" />
              <Button v-if="data.estado === 1" icon="pi pi-ban" text rounded severity="danger" @click="confirmDelete(data)" title="Marcar como Histórico" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Formulario -->
    <Dialog v-model:visible="formDialog" :style="{width: '500px'}" :header="isEditing ? 'Editar Tarifa' : 'Nueva Tarifa'" :modal="true" class="p-fluid" :pt="dialogFormPt">
      <FormTarifa 
        :initialData="tarifaActual" 
        :isEditing="isEditing" 
        @save="saveTarifa" 
        @cancel="formDialog = false" 
      />
    </Dialog>

    <!-- Modal Confirmación -->
    <Dialog v-model:visible="deleteDialog" :style="{width: '450px'}" header="Confirmar Baja" :modal="true" :pt="dialogConfirmPt">
      <div class="flex items-center gap-4">
        <i class="pi pi-exclamation-triangle text-red-500 text-4xl" />
        <span v-if="tarifaActual">¿Deseas marcar esta tarifa como histórica?</span>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" text @click="deleteDialog = false"/>
        <Button label="Sí, Desactivar" icon="pi pi-check" severity="danger" @click="deleteTarifa" />
      </template>
    </Dialog>

  </div>
</template>

<script setup>
import { ref, onMounted, computed } from 'vue';
import { useStore } from '../../../store/useStore';
import { useToast } from 'primevue/usetoast';
import { dialogFormPt, dialogConfirmPt } from '../../../utils/dialogPt';
import Button from 'primevue/button';
import Toolbar from 'primevue/toolbar';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Dropdown from 'primevue/dropdown';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';

import FormTarifa from '../../../components/forms/FormTarifa.vue';

const store = useStore();
const toast = useToast();

const tarifas = ref([]);
const edificios = ref([]);
const tiposServicio = ref(['AGUA', 'LUZ']);
const formDialog = ref(false);
const deleteDialog = ref(false);
const isEditing = ref(false);
const tarifaActual = ref({});
const filtroEdificio = ref(null);
const filtroServicio = ref(null);

onMounted(() => {
  tarifas.value = store.state.tarifas;
  edificios.value = store.state.edificios;
});

const tarifasFiltradas = computed(() => {
  return tarifas.value.map(t => {
    const e = edificios.value.find(edif => edif.id === t.id_edificio);
    return { ...t, edificio_nombre: e ? e.nombre : 'N/A' };
  }).filter(t => {
    let match = true;
    if (filtroEdificio.value && t.id_edificio !== filtroEdificio.value) match = false;
    if (filtroServicio.value && t.tipo_servicio !== filtroServicio.value) match = false;
    return match;
  });
});

const openNew = () => {
  tarifaActual.value = {};
  isEditing.value = false;
  formDialog.value = true;
};

const editTarifa = (tarifa) => {
  tarifaActual.value = { ...tarifa };
  isEditing.value = true;
  formDialog.value = true;
};

const saveTarifa = (data) => {
  if (isEditing.value) {
    const index = tarifas.value.findIndex(t => t.id === data.id);
    if (index !== -1) {
      tarifas.value[index] = data;
      store.state.tarifas = [...tarifas.value];
    }
    toast.add({severity:'success', summary: 'Actualizado', detail: 'Tarifa actualizada', life: 3000});
  } else {
    data.id = Math.max(...tarifas.value.map(t => t.id), 0) + 1;
    tarifas.value.unshift(data);
    store.state.tarifas = [...tarifas.value];
    toast.add({severity:'success', summary: 'Creado', detail: 'Tarifa registrada', life: 3000});
  }
  formDialog.value = false;
};

const confirmDelete = (tarifa) => {
  tarifaActual.value = { ...tarifa };
  deleteDialog.value = true;
};

const deleteTarifa = () => {
  const index = tarifas.value.findIndex(t => t.id === tarifaActual.value.id);
  if (index !== -1) {
    tarifas.value[index].estado = 0;
    store.state.tarifas = [...tarifas.value];
  }
  deleteDialog.value = false;
  toast.add({severity:'success', summary: 'Baja Exitosa', detail: 'La tarifa pasó al histórico', life: 3000});
};
</script>
