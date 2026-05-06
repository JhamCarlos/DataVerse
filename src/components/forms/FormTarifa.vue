<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Edificio y Servicio -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="edificio" class="font-medium text-sm text-gray-700">Edificio *</label>
        <Dropdown id="edificio" v-model="formData.id_edificio" :options="edificios" optionLabel="nombre" optionValue="id" placeholder="Seleccione Edificio" class="w-full" :disabled="isEditing" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="servicio" class="font-medium text-sm text-gray-700">Tipo de Servicio *</label>
        <Dropdown id="servicio" v-model="formData.tipo_servicio" :options="tiposServicio" placeholder="AGUA o LUZ" :disabled="isEditing" />
      </div>
    </div>

    <!-- Fila 2: Precio y Unidad -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="precio" class="font-medium text-sm text-gray-700">Precio Unitario *</label>
        <InputNumber id="precio" v-model="formData.precio_unitario" mode="currency" currency="USD" locale="en-US" :minFractionDigits="2" :maxFractionDigits="4" required />
      </div>
      <div class="flex flex-col gap-2">
        <label for="unidad" class="font-medium text-sm text-gray-700">Unidad de Medida *</label>
        <InputText id="unidad" v-model="formData.unidad" placeholder="Ej. m³ o kWh" required />
      </div>
    </div>

    <!-- Fila 3: Vigencia -->
    <div class="flex flex-col gap-2">
      <label for="fecha_vigencia" class="font-medium text-sm text-gray-700">Fecha de Inicio de Vigencia *</label>
      <Calendar id="fecha_vigencia" v-model="formData.fecha_vigencia_desde" dateFormat="yy-mm-dd" showIcon required />
    </div>

    <!-- Fila 4: Estado -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Tarifa Vigente</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Registrar Tarifa'" />
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

const edificios = ref([]);
const tiposServicio = ref(['AGUA', 'LUZ']);

onMounted(() => {
  edificios.value = store.state.edificios.filter(e => e.estado === 1);
});

const formData = ref({
  id_edificio: null,
  tipo_servicio: 'AGUA',
  precio_unitario: 0,
  unidad: '',
  fecha_vigencia_desde: null,
  estado: 1
});

const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
    // Ajustar tipo de fecha
    if (typeof formData.value.fecha_vigencia_desde === 'string') {
      formData.value.fecha_vigencia_desde = new Date(formData.value.fecha_vigencia_desde + 'T00:00:00');
    }
  } else {
    formData.value = { id_edificio: null, tipo_servicio: 'AGUA', precio_unitario: 0, unidad: '', fecha_vigencia_desde: null, estado: 1 };
  }
}, { immediate: true });

const handleSubmit = () => {
  const dataToSave = { ...formData.value };
  if (dataToSave.fecha_vigencia_desde instanceof Date) {
    dataToSave.fecha_vigencia_desde = dataToSave.fecha_vigencia_desde.toISOString().split('T')[0];
  }
  emit('save', dataToSave);
};
</script>
