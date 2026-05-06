<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Boleta Asociada -->
    <div class="flex flex-col gap-2">
      <label for="boleta" class="font-medium text-sm text-gray-700">Boleta a Pagar *</label>
      <Dropdown id="boleta" v-model="formData.id_boleta" :options="boletasPendientes" optionLabel="label_boleta" optionValue="id" filter placeholder="Seleccione una boleta" class="w-full" @change="cargarMontoBoleta" :disabled="isEditing" />
    </div>

    <!-- Fila 2: Fecha y Monto -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="fecha_pago" class="font-medium text-sm text-gray-700">Fecha de Pago *</label>
        <Calendar id="fecha_pago" v-model="formData.fecha_pago" dateFormat="yy-mm-dd" showTime showIcon />
      </div>
      <div class="flex flex-col gap-2">
        <label for="monto" class="font-medium text-sm text-gray-700">Monto Pagado *</label>
        <InputNumber id="monto" v-model="formData.monto_pagado" mode="currency" currency="USD" locale="en-US" />
      </div>
    </div>

    <!-- Fila 3: Método de Pago y N° Operación -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="metodo_pago" class="font-medium text-sm text-gray-700">Método de Pago *</label>
        <Dropdown id="metodo_pago" v-model="formData.id_tipo_pago" :options="metodosPago" placeholder="Seleccione Método" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="num_operacion" class="font-medium text-sm text-gray-700">N° de Operación / Voucher</label>
        <InputText id="num_operacion" v-model="formData.numero_operacion" placeholder="Ej. OP-123456" />
      </div>
    </div>

    <!-- Fila 4: Estado de Validación -->
    <div class="flex flex-col gap-2 mt-2">
      <label for="estado_validacion" class="font-medium text-sm text-gray-700">Estado de Validación *</label>
      <Dropdown id="estado_validacion" v-model="formData.estado_validacion" :options="estadosValidacion" placeholder="Seleccione Estado" />
    </div>

    <!-- Fila 5: Estado Lógico (Soft Delete) -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Registro Válido en Sistema</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Actualizar Pago' : 'Registrar Pago'" />
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

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false }
});

const emit = defineEmits(['save', 'cancel']);
const store = useStore();

const metodosPago = ref(['TRANSFERENCIA', 'EFECTIVO', 'TARJETA', 'YAPE', 'PLIN']);
const estadosValidacion = ref(['PENDIENTE', 'APROBADO', 'RECHAZADO']);
const boletasPendientes = ref([]);

onMounted(() => {
  // Cargar boletas que están pendientes para asociarlas a un pago
  const allBoletas = store.state.boletas.filter(b => b.estado === 1);
  if (props.isEditing) {
    // Si estamos editando, mostrar todas las boletas para que se vea el label
    boletasPendientes.value = allBoletas.map(b => ({
      ...b,
      label_boleta: `${b.contrato_codigo} - Período ${b.periodo} - Total: $${b.monto_total}`
    }));
  } else {
    // Si es nuevo pago, solo mostrar pendientes
    boletasPendientes.value = allBoletas.filter(b => b.estado_boleta === 'PENDIENTE').map(b => ({
      ...b,
      label_boleta: `${b.contrato_codigo} - Período ${b.periodo} - Total: $${b.monto_total}`
    }));
  }
});

const formData = ref({
  id_boleta: null,
  boleta_periodo: '',
  fecha_pago: new Date(),
  monto_pagado: 0,
  id_tipo_pago: 'TRANSFERENCIA',
  numero_operacion: '',
  estado_validacion: 'APROBADO', // Por defecto si lo registra admin
  estado: 1
});

const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

const cargarMontoBoleta = () => {
  if (!props.isEditing && formData.value.id_boleta) {
    const b = boletasPendientes.value.find(x => x.id === formData.value.id_boleta);
    if (b) {
      formData.value.monto_pagado = b.monto_total;
      formData.value.boleta_periodo = b.periodo;
    }
  }
};

watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
    // Convertir string de fecha a objeto Date
    if (typeof formData.value.fecha_pago === 'string') {
      // Reemplaza espacio con T si es formato 'YYYY-MM-DD HH:mm:ss'
      const dateStr = formData.value.fecha_pago.replace(' ', 'T');
      formData.value.fecha_pago = new Date(dateStr);
    }
  } else {
    formData.value = {
      id_boleta: null, boleta_periodo: '', fecha_pago: new Date(),
      monto_pagado: 0, id_tipo_pago: 'TRANSFERENCIA', numero_operacion: '',
      estado_validacion: 'APROBADO', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  const b = boletasPendientes.value.find(x => x.id === formData.value.id_boleta);
  if (b) {
    formData.value.boleta_periodo = b.periodo;
    formData.value.contrato_codigo = b.contrato_codigo; // Para facilitar vista
  }

  const dataToSave = { ...formData.value };
  
  // Format datetime back to string
  if (dataToSave.fecha_pago instanceof Date) {
    dataToSave.fecha_pago = dataToSave.fecha_pago.toISOString().replace('T', ' ').split('.')[0];
  }

  emit('save', dataToSave);
};
</script>
