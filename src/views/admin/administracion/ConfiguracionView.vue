<template>
  <div class="space-y-4">
    <!-- Header Page -->
    <div class="flex justify-between items-center mb-6">
      <div>
        <h2 class="text-2xl font-bold text-gray-800 tracking-tight">Configuración del Sistema</h2>
        <p class="text-sm text-gray-500 mt-1">Ajustes generales de la empresa y parámetros de facturación</p>
      </div>
    </div>

    <div class="grid grid-cols-1 md:grid-cols-2 gap-6">
      <!-- Datos de la Empresa -->
      <div class="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <i class="pi pi-building text-primary"></i> Datos de Milano & Asociados
        </h3>
        
        <div class="p-fluid space-y-4">
          <div class="field">
            <label class="font-bold block mb-2">Razón Social</label>
            <InputText v-model="config.razonSocial" />
          </div>
          <div class="field">
            <label class="font-bold block mb-2">RUC</label>
            <InputText v-model="config.ruc" />
          </div>
          <div class="field">
            <label class="font-bold block mb-2">Dirección Fiscal</label>
            <InputText v-model="config.direccion" />
          </div>
          <div class="field">
            <label class="font-bold block mb-2">Teléfono de Soporte</label>
            <InputText v-model="config.telefono" />
          </div>
        </div>
      </div>

      <!-- Parámetros de Facturación -->
      <div class="bg-white p-6 border border-gray-200 shadow-sm rounded-lg space-y-4">
        <h3 class="text-lg font-semibold text-gray-700 border-b pb-2 flex items-center gap-2">
          <i class="pi pi-file-edit text-primary"></i> Parámetros de Facturación
        </h3>
        
        <div class="p-fluid space-y-4">
          <div class="field">
            <label class="font-bold block mb-2">Moneda del Sistema</label>
            <Dropdown v-model="config.moneda" :options="['Dólares (USD)', 'Soles (PEN)']" />
          </div>
          <div class="field">
            <label class="font-bold block mb-2">Mora por Día de Atraso (%)</label>
            <InputText v-model="config.mora" type="number" />
          </div>
          <div class="flex items-center justify-between p-3 bg-blue-50 rounded-md">
            <div>
              <div class="font-bold text-blue-800">Generación Automática</div>
              <div class="text-xs text-blue-600">Generar boletas el primer día del mes</div>
            </div>
            <InputSwitch v-model="config.autoGenerate" />
          </div>
        </div>
        
        <div class="pt-4">
          <Button label="Guardar Cambios" icon="pi pi-save" class="w-full" @click="saveConfig" />
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useToast } from 'primevue/usetoast';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';

const toast = useToast();

const config = ref({
  razonSocial: 'Milano & Asociados S.A.C.',
  ruc: '20601234567',
  direccion: 'Calle Los Pinos 456, San Isidro',
  telefono: '01 445-5678',
  moneda: 'Dólares (USD)',
  mora: 1.5,
  autoGenerate: true
});

const saveConfig = () => {
  toast.add({severity:'success', summary: 'Configuración Guardada', detail: 'Los ajustes se aplicaron correctamente', life: 3000});
};
</script>
