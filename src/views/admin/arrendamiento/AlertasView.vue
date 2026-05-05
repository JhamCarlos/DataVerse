<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Alertas de Vencimiento</h2>
        <p class="text-sm text-gray-500 mt-1">Monitoreo automático de contratos próximos a vencer</p>
      </div>
    </div>

    <!-- Data Table PrimeVue (Read Only) -->
    <div class="bg-white p-4 border border-gray-200 shadow-sm rounded-lg">
      <DataTable ref="dt" :value="alertas" dataKey="id" :paginator="true" :rows="10" 
                 responsiveLayout="scroll" :rowHover="true" class="p-datatable-sm">
                 
        <template #empty>
          <div class="text-center py-8 text-gray-500">No hay alertas de vencimiento activas en este momento.</div>
        </template>

        <Column field="contrato_codigo" header="Contrato" style="min-width: 10rem">
          <template #body="{ data }">
            <span class="font-bold text-gray-800">{{ data.contrato_codigo }}</span>
          </template>
        </Column>

        <Column field="tipo_alerta" header="Tipo de Alerta" style="min-width: 12rem">
          <template #body="{ data }">
            <Tag severity="warning" :value="data.tipo_alerta" />
          </template>
        </Column>

        <Column field="mensaje" header="Mensaje" style="min-width: 16rem"></Column>

        <Column field="fecha_alerta" header="Fecha Notificación" style="min-width: 12rem"></Column>

        <!-- Acciones: Solo permite ver el contrato o descartar alerta simulada -->
        <Column header="Acciones" style="min-width: 10rem; text-align: center">
          <template #body="{ data }">
            <Button icon="pi pi-check" label="Entendido" text rounded severity="success" @click="marcarLeida(data)" />
          </template>
        </Column>
      </DataTable>
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import { useStore } from '../../../store/useStore';
import { useToast } from 'primevue/usetoast';
import Button from 'primevue/button';
import DataTable from 'primevue/datatable';
import Column from 'primevue/column';
import Tag from 'primevue/tag';

const store = useStore();
const toast = useToast();
const alertas = ref([]);

onMounted(() => {
  alertas.value = store.state.alertas.filter(a => a.estado === 1);
});

const marcarLeida = (alerta) => {
  const index = alertas.value.findIndex(a => a.id === alerta.id);
  if (index !== -1) {
    alertas.value[index].estado = 0; // Soft delete / marcar leida
  }
  toast.add({severity:'success', summary: 'Alerta Gestionada', detail: 'La alerta fue marcada como revisada.', life: 3000});
};
</script>
