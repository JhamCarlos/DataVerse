<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Código y Estado Contrato -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="codigo" class="font-medium text-sm text-gray-700">Código del Contrato</label>
        <InputText id="codigo" v-model="formData.codigo" disabled placeholder="Autogenerado" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="estado_contrato" class="font-medium text-sm text-gray-700">Estado del Contrato *</label>
        <Dropdown id="estado_contrato" v-model="formData.estado_contrato" :options="estadosContrato" placeholder="Seleccione Estado" :disabled="!isEditing" />
      </div>
    </div>

    <!-- Fila 2: Inquilino y Departamento -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="inquilino" class="font-medium text-sm text-gray-700">Inquilino *</label>
        <Dropdown id="inquilino" v-model="formData.id_inquilino" :options="inquilinos" optionLabel="nombres_completos" optionValue="id" filter placeholder="Buscar Inquilino" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="departamento" class="font-medium text-sm text-gray-700">Departamento *</label>
        <Dropdown id="departamento" v-model="formData.id_departamento" :options="departamentos" optionLabel="label_dpto" optionValue="id" filter placeholder="Buscar Departamento" class="w-full" />
      </div>
    </div>

    <!-- Fila 3: Fechas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="fecha_inicio" class="font-medium text-sm text-gray-700">Fecha de Inicio *</label>
        <Calendar id="fecha_inicio" v-model="formData.fecha_inicio" dateFormat="yy-mm-dd" showIcon />
      </div>
      <div class="flex flex-col gap-2">
        <label for="fecha_fin" class="font-medium text-sm text-gray-700">Fecha de Fin *</label>
        <Calendar id="fecha_fin" v-model="formData.fecha_fin" dateFormat="yy-mm-dd" showIcon />
      </div>
    </div>

    <!-- Fila 4: Montos y Día -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="monto" class="font-medium text-sm text-gray-700">Monto Alquiler *</label>
        <InputNumber id="monto" v-model="formData.monto_alquiler" mode="currency" currency="USD" locale="en-US" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="garantia" class="font-medium text-sm text-gray-700">Garantía *</label>
        <InputNumber id="garantia" v-model="formData.deposito_garantia" mode="currency" currency="USD" locale="en-US" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="dia_pago" class="font-medium text-sm text-gray-700">Día de Pago *</label>
        <InputNumber id="dia_pago" v-model="formData.dia_pago" :min="1" :max="31" />
      </div>
    </div>

    <!-- Fila 5: Estado (Soft Delete) -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Registro Activo</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Generar Contrato'" />
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

const estadosContrato = ref(['BORRADOR', 'ACTIVO', 'FINALIZADO', 'ANULADO']);
const inquilinos = ref([]);
const departamentos = ref([]);

onMounted(() => {
  inquilinos.value = store.state.inquilinos.filter(i => i.estado === 1).map(i => ({
    ...i,
    nombres_completos: `${i.numero_documento} - ${i.nombres} ${i.apellido_paterno}`
  }));

  departamentos.value = store.state.departamentos.filter(d => d.estado === 1).map(d => ({
    ...d,
    label_dpto: `${d.nombre_edificio} - Dpto ${d.numero_dpto}`
  }));
});

const formData = ref({
  codigo: '',
  id_inquilino: null,
  id_departamento: null,
  fecha_inicio: null,
  fecha_fin: null,
  monto_alquiler: 0,
  deposito_garantia: 0,
  dia_pago: 5,
  estado_contrato: 'BORRADOR',
  estado: 1
});

const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
    // Convertir fechas string a objetos Date para el Calendar
    if (typeof formData.value.fecha_inicio === 'string') {
      formData.value.fecha_inicio = new Date(formData.value.fecha_inicio + 'T00:00:00');
    }
    if (typeof formData.value.fecha_fin === 'string') {
      formData.value.fecha_fin = new Date(formData.value.fecha_fin + 'T00:00:00');
    }
  } else {
    formData.value = {
      codigo: '', id_inquilino: null, id_departamento: null, fecha_inicio: null, fecha_fin: null,
      monto_alquiler: 0, deposito_garantia: 0, dia_pago: 5, estado_contrato: 'BORRADOR', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  const inq = inquilinos.value.find(i => i.id === formData.value.id_inquilino);
  const dep = departamentos.value.find(d => d.id === formData.value.id_departamento);
  
  if (inq) formData.value.inquilino_nombre = `${inq.nombres} ${inq.apellido_paterno}`;
  if (dep) formData.value.departamento_numero = dep.label_dpto;
  
  // Generar código mock si es nuevo
  if (!formData.value.codigo) {
    formData.value.codigo = `CTR-2026-${Math.floor(Math.random() * 1000).toString().padStart(3, '0')}`;
  }

  // Convertir Date a String YYYY-MM-DD para guardar en la BD simulada
  const dataToSave = { ...formData.value };
  if (dataToSave.fecha_inicio instanceof Date) {
    dataToSave.fecha_inicio = dataToSave.fecha_inicio.toISOString().split('T')[0];
  }
  if (dataToSave.fecha_fin instanceof Date) {
    dataToSave.fecha_fin = dataToSave.fecha_fin.toISOString().split('T')[0];
  }

  emit('save', dataToSave);
};
</script>
