<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Edificio y Categoría -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="edificio" class="font-medium text-sm text-gray-700">Edificio *</label>
        <Dropdown id="edificio" v-model="formData.id_edificio" :options="edificios" optionLabel="nombre" optionValue="id" placeholder="Seleccione Edificio" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="categoria" class="font-medium text-sm text-gray-700">Categoría *</label>
        <Dropdown id="categoria" v-model="formData.categoria" :options="categorias" placeholder="Seleccione Categoría" class="w-full" />
      </div>
    </div>

    <!-- Fila 2: Descripción -->
    <div class="flex flex-col gap-2">
      <label for="descripcion" class="font-medium text-sm text-gray-700">Descripción del Gasto *</label>
      <Textarea id="descripcion" v-model="formData.descripcion" required rows="3" autoResize placeholder="Ej. Compra de insumos de limpieza para áreas comunes" />
    </div>

    <!-- Fila 3: Fechas y Montos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="fecha_gasto" class="font-medium text-sm text-gray-700">Fecha del Gasto *</label>
        <Calendar id="fecha_gasto" v-model="formData.fecha_gasto" dateFormat="yy-mm-dd" showIcon />
      </div>
      <div class="flex flex-col gap-2">
        <label for="monto" class="font-medium text-sm text-gray-700">Monto *</label>
        <InputNumber id="monto" v-model="formData.monto" mode="currency" currency="USD" locale="en-US" />
      </div>
    </div>

    <!-- Fila 4: Estado Aprobación -->
    <div class="flex flex-col gap-2 mt-2">
      <label for="estado_gasto" class="font-medium text-sm text-gray-700">Estado de Aprobación *</label>
      <Dropdown id="estado_gasto" v-model="formData.estado_gasto" :options="estadosGasto" placeholder="Seleccione Estado" />
    </div>

    <!-- Fila 5: Estado Lógico (Soft Delete) -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Registro Válido en Sistema</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Actualizar Gasto' : 'Registrar Gasto'" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from '../../store/useStore';
import InputNumber from 'primevue/inputnumber';
import Textarea from 'primevue/textarea';
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

const categorias = ref(['LIMPIEZA', 'MANTENIMIENTO_BOMBA', 'JARDINERIA', 'PINTURA', 'REPARACION_GENERAL', 'COMPRA_INSUMOS']);
const estadosGasto = ref(['PENDIENTE', 'APROBADO', 'CANCELADO']);
const edificios = ref([]);

onMounted(() => {
  edificios.value = store.state.edificios.filter(e => e.estado === 1);
});

const formData = ref({
  id_edificio: null,
  edificio_nombre: '',
  categoria: '',
  descripcion: '',
  monto: 0,
  fecha_gasto: new Date(),
  estado_gasto: 'PENDIENTE',
  estado: 1
});

const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
    if (typeof formData.value.fecha_gasto === 'string') {
      formData.value.fecha_gasto = new Date(formData.value.fecha_gasto + 'T00:00:00');
    }
  } else {
    formData.value = {
      id_edificio: null, edificio_nombre: '', categoria: '', descripcion: '',
      monto: 0, fecha_gasto: new Date(), estado_gasto: 'PENDIENTE', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  const edif = edificios.value.find(e => e.id === formData.value.id_edificio);
  if (edif) {
    formData.value.edificio_nombre = edif.nombre;
  }

  const dataToSave = { ...formData.value };
  
  if (dataToSave.fecha_gasto instanceof Date) {
    dataToSave.fecha_gasto = dataToSave.fecha_gasto.toISOString().split('T')[0];
  }

  emit('save', dataToSave);
};
</script>
