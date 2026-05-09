<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex justify-between items-center">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Mis Boletas</h2>
        <p class="text-sm text-gray-500 mt-1">Historial de pagos y liquidaciones de tu departamento</p>
      </div>
      <Button label="Reportar Pago" icon="pi pi-upload" class="p-button-success shadow-md" @click="showReportModal = true" />
    </div>

    <!-- Filtros Rápidos -->
    <div class="flex gap-4">
      <div class="bg-white px-4 py-2 rounded-lg border border-gray-200 text-sm font-medium text-gray-600">
        Total Boletas: <span class="text-gray-900 font-bold">{{ misBoletas.length }}</span>
      </div>
      <div class="bg-orange-50 px-4 py-2 rounded-lg border border-orange-200 text-sm font-medium text-orange-700">
        Pendientes: <span class="font-bold">{{ pendientesCount }}</span>
      </div>
    </div>

    <!-- Tabla de Boletas -->
    <div class="bg-white rounded-2xl border border-gray-200 shadow-sm overflow-hidden">
      <DataTable :value="misBoletas" responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
        <template #empty>
          <div class="text-center py-12 text-gray-400">No se encontraron boletas en tu historial.</div>
        </template>

        <Column field="periodo" header="Periodo" sortable>
          <template #body="{ data }">
            <span class="font-bold text-gray-800">{{ data.periodo }}</span>
          </template>
        </Column>

        <Column field="fecha_vencimiento" header="Vencimiento" sortable></Column>

        <Column field="monto_total" header="Monto Total" sortable>
          <template #body="{ data }">
            <span class="font-extrabold text-primary">${{ data.monto_total.toFixed(2) }}</span>
          </template>
        </Column>

        <Column field="estado_boleta" header="Estado" sortable>
          <template #body="{ data }">
            <Tag :severity="data.estado_boleta === 'PAGADA' ? 'success' : 'warning'" :value="data.estado_boleta" />
          </template>
        </Column>

        <Column header="Acciones" style="text-align: center">
          <template #body="{ data }">
            <div class="flex justify-center gap-2">
              <Button icon="pi pi-download" class="p-button-rounded p-button-text p-button-secondary" v-tooltip.top="'Descargar PDF'" />
              <Button v-if="data.estado_boleta === 'PENDIENTE'" icon="pi pi-credit-card" class="p-button-rounded p-button-text p-button-success" v-tooltip.top="'Informar Pago'" @click="reportarPagoEspecifico(data)" />
            </div>
          </template>
        </Column>
      </DataTable>
    </div>

    <!-- Modal Reportar Pago (Mock) -->
    <Dialog v-model:visible="showReportModal" header="Reportar Pago Realizado" :modal="true" :style="{width: '450px'}" :pt="dialogFormPt">
      <div class="p-fluid space-y-4 pt-4">
        <div class="field">
          <label class="font-bold mb-2 block">Seleccionar Boleta</label>
          <Dropdown v-model="reportForm.boletaId" :options="boletasPendientesOptions" optionLabel="label" optionValue="value" placeholder="¿Qué boleta pagaste?" />
        </div>
        <div class="field">
          <label class="font-bold mb-2 block">Número de Operación / Referencia</label>
          <InputText v-model="reportForm.referencia" placeholder="Ej: OP-123456" />
        </div>
        <div class="field">
          <label class="font-bold mb-2 block">Fecha de Pago</label>
          <Calendar v-model="reportForm.fecha" dateFormat="dd/mm/yy" showIcon />
        </div>
        <div class="field">
          <label class="font-bold mb-2 block">Comprobante (Imagen/PDF)</label>
          <div class="border-2 border-dashed border-gray-300 rounded-xl p-8 text-center hover:border-green-500 transition-colors cursor-pointer bg-gray-50">
            <i class="pi pi-upload text-3xl text-gray-400 mb-2"></i>
            <p class="text-sm text-gray-500">Haz clic o arrastra el archivo aquí</p>
          </div>
        </div>
      </div>
      <template #footer>
        <Button label="Cancelar" icon="pi pi-times" class="p-button-text" @click="showReportModal = false" />
        <Button label="Enviar Reporte" icon="pi pi-check" class="p-button-success" @click="submitReport" />
      </template>
    </Dialog>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '../../store/useStore';
import { useToast } from 'primevue/usetoast';
import { dialogFormPt } from '../../utils/dialogPt';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Button from 'primevue/button';
import Tag from 'primevue/tag';
import Dialog from 'primevue/dialog';
import Dropdown from 'primevue/dropdown';
import InputText from 'primevue/inputtext';
import Calendar from 'primevue/calendar';

const store = useStore();
const toast = useToast();
const currentInquilinoId = store.state.currentUser?.id_inquilino;

const showReportModal = ref(false);
const reportForm = ref({
  boletaId: null,
  referencia: '',
  fecha: new Date()
});

const misBoletas = computed(() => {
  if (!currentInquilinoId) return [];
  const misContratosIds = store.state.contratos
    .filter(c => c.id_inquilino === currentInquilinoId)
    .map(c => c.id);
  return store.state.boletas.filter(b => misContratosIds.includes(b.id_contrato));
});

const pendientesCount = computed(() => {
  return misBoletas.value.filter(b => b.estado_boleta === 'PENDIENTE').length;
});

const boletasPendientesOptions = computed(() => {
  return misBoletas.value
    .filter(b => b.estado_boleta === 'PENDIENTE')
    .map(b => ({ label: `Periodo ${b.periodo} - $${b.monto_total.toFixed(2)}`, value: b.id }));
});

const reportarPagoEspecifico = (boleta) => {
  reportForm.value.boletaId = boleta.id;
  showReportModal.value = true;
};

const submitReport = () => {
  if (!reportForm.value.boletaId || !reportForm.value.referencia) {
    toast.add({severity:'error', summary: 'Error', detail: 'Por favor completa los campos requeridos', life: 3000});
    return;
  }
  
  toast.add({severity:'success', summary: 'Reporte Enviado', detail: 'Tu pago está siendo validado por administración', life: 5000});
  showReportModal.value = false;
  reportForm.value = { boletaId: null, referencia: '', fecha: new Date() };
};
</script>
