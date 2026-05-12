<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Contrato -->
    <div class="flex flex-col gap-2">
      <label for="contrato" class="font-medium text-sm text-gray-700">Contrato Asociado *</label>
      <Dropdown id="contrato" v-model="formData.id_contrato" :options="contratos" optionLabel="label_contrato" optionValue="id" filter placeholder="Seleccione un contrato" class="w-full" @change="cargarMontoAlquiler" />
    </div>

    <!-- Fila 2: Periodo y Estado -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="periodo" class="font-medium text-sm text-gray-700">Periodo (YYYY-MM) *</label>
        <InputText id="periodo" v-model="formData.periodo" required placeholder="Ej. 2024-05" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="estado_boleta" class="font-medium text-sm text-gray-700">Estado de Boleta *</label>
        <Dropdown id="estado_boleta" v-model="formData.estado_boleta" :options="estadosBoleta" placeholder="Seleccione Estado">
          <template #option="slotProps">
            <Tag :severity="getSeverity(slotProps.option)" :value="slotProps.option" />
          </template>
        </Dropdown>
      </div>
    </div>

    <!-- Fila 3: Fechas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="fecha_emision" class="font-medium text-sm text-gray-700">Fecha de Emisión *</label>
        <Calendar id="fecha_emision" v-model="formData.fecha_emision" dateFormat="yy-mm-dd" showIcon />
      </div>
      <div class="flex flex-col gap-2">
        <label for="fecha_vencimiento" class="font-medium text-sm text-gray-700">Fecha de Vencimiento *</label>
        <Calendar id="fecha_vencimiento" v-model="formData.fecha_vencimiento" dateFormat="yy-mm-dd" showIcon />
      </div>
    </div>

    <!-- Fila 4: Detalle de Conceptos -->
    <div class="bg-gray-50 p-4 rounded-lg border border-gray-200 mt-2">
      <h3 class="text-sm font-semibold text-gray-800 mb-4 border-b border-gray-200 pb-2">Detalle de Cobros</h3>
      <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
        <div class="flex flex-col gap-2">
          <label for="monto_alquiler" class="font-medium text-sm text-gray-600">Alquiler</label>
          <InputNumber id="monto_alquiler" v-model="formData.monto_alquiler" mode="currency" currency="USD" locale="en-US" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="monto_mantenimiento" class="font-medium text-sm text-gray-600">Mantenimiento</label>
          <InputNumber id="monto_mantenimiento" v-model="formData.monto_mantenimiento" mode="currency" currency="USD" locale="en-US" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="monto_agua" class="font-medium text-sm text-gray-600">Agua</label>
          <InputNumber id="monto_agua" v-model="formData.monto_agua" mode="currency" currency="USD" locale="en-US" />
        </div>
        <div class="flex flex-col gap-2">
          <label for="monto_luz" class="font-medium text-sm text-gray-600">Luz</label>
          <InputNumber id="monto_luz" v-model="formData.monto_luz" mode="currency" currency="USD" locale="en-US" />
        </div>
      </div>
      
      <!-- Total Computado -->
      <div class="mt-4 pt-3 border-t border-gray-200 flex justify-between items-center">
        <span class="font-semibold text-gray-700">Total a Cobrar:</span>
        <span class="text-xl font-bold text-primary">${{ totalMonto.toFixed(2) }}</span>
      </div>
    </div>

    <!-- Fila 5: Estado Lógico (Soft Delete) -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Registro Válido en Sistema</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Generar Boleta'" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from '../../store/useStore';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Calendar from 'primevue/calendar';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';
import Tag from 'primevue/tag';

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false }
});

const emit = defineEmits(['save', 'cancel']);
const store = useStore();

const estadosBoleta = ref(['PENDIENTE', 'PAGADA', 'VENCIDA', 'ANULADA']);
const contratos = ref([]);

onMounted(() => {
  // Solo cargamos contratos que estén activos para generarles boletas
  contratos.value = store.state.contratos.filter(c => c.estado === 1 && c.estado_contrato === 'ACTIVO').map(c => ({
    ...c,
    label_contrato: `${c.codigo} - ${c.inquilino_nombre} (${c.departamento_numero})`
  }));
});

const formData = ref({
  id_contrato: null,
  contrato_codigo: '',
  periodo: '',
  fecha_emision: new Date(),
  fecha_vencimiento: new Date(new Date().setDate(new Date().getDate() + 5)),
  monto_alquiler: 0,
  monto_agua: 0,
  monto_luz: 0,
  monto_mantenimiento: 0,
  estado_boleta: 'PENDIENTE',
  estado: 1
});

const getSeverity = (estado) => {
  switch (estado) {
    case 'PAGADA': return 'success';
    case 'PENDIENTE': return 'warn';
    case 'VENCIDA': return 'danger';
    default: return 'info';
  }
};

const totalMonto = computed(() => {
  return (formData.value.monto_alquiler || 0) + 
         (formData.value.monto_agua || 0) + 
         (formData.value.monto_luz || 0) + 
         (formData.value.monto_mantenimiento || 0);
});

const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

const cargarMontoAlquiler = () => {
  if (!props.isEditing && formData.value.id_contrato) {
    const c = contratos.value.find(c => c.id === formData.value.id_contrato);
    if (c) {
      formData.value.monto_alquiler = c.monto_alquiler;
    }
  }
};

watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
    // Convertir fechas string a objetos Date para el Calendar
    if (typeof formData.value.fecha_emision === 'string') {
      formData.value.fecha_emision = new Date(formData.value.fecha_emision + 'T00:00:00');
    }
    if (typeof formData.value.fecha_vencimiento === 'string') {
      formData.value.fecha_vencimiento = new Date(formData.value.fecha_vencimiento + 'T00:00:00');
    }
  } else {
    // Valores por defecto
    const today = new Date();
    const vencimiento = new Date();
    vencimiento.setDate(today.getDate() + 5);
    
    formData.value = {
      id_contrato: null, contrato_codigo: '', periodo: '', 
      fecha_emision: today, fecha_vencimiento: vencimiento,
      monto_alquiler: 0, monto_agua: 0, monto_luz: 0, monto_mantenimiento: 0,
      estado_boleta: 'PENDIENTE', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  const cont = contratos.value.find(c => c.id === formData.value.id_contrato);
  if (cont) {
    formData.value.contrato_codigo = cont.codigo;
  }
  
  formData.value.monto_total = totalMonto.value;

  const dataToSave = { ...formData.value };
  
  // Format dates back to string
  if (dataToSave.fecha_emision instanceof Date) {
    dataToSave.fecha_emision = dataToSave.fecha_emision.toISOString().split('T')[0];
  }
  if (dataToSave.fecha_vencimiento instanceof Date) {
    dataToSave.fecha_vencimiento = dataToSave.fecha_vencimiento.toISOString().split('T')[0];
  }

  emit('save', dataToSave);
};
</script>
