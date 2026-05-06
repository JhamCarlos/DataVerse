<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Edificio y Número -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="edificio" class="font-medium text-sm text-gray-700">Edificio *</label>
        <Dropdown id="edificio" v-model="formData.id_edificio" :options="edificios" optionLabel="nombre" optionValue="id" placeholder="Seleccione Edificio" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="numero" class="font-medium text-sm text-gray-700">Número Departamento *</label>
        <InputText id="numero" v-model="formData.numero_dpto" required placeholder="Ej. 301" />
      </div>
    </div>

    <!-- Fila 2: Piso y Área -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="piso" class="font-medium text-sm text-gray-700">Piso *</label>
        <InputNumber id="piso" v-model="formData.piso" required showButtons :min="1" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="area" class="font-medium text-sm text-gray-700">Área (m²) *</label>
        <InputNumber id="area" v-model="formData.area_m2" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" suffix=" m²" required />
      </div>
    </div>

    <!-- Fila 3: Ambientes -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="habitaciones" class="font-medium text-sm text-gray-700">Habitaciones</label>
        <InputNumber id="habitaciones" v-model="formData.num_habitaciones" showButtons :min="0" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="banos" class="font-medium text-sm text-gray-700">Baños</label>
        <InputNumber id="banos" v-model="formData.num_banos" mode="decimal" :minFractionDigits="1" showButtons :min="0" :step="0.5" />
      </div>
    </div>

    <!-- Fila 4: Ocupación y Medidores -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="ocupacion" class="font-medium text-sm text-gray-700">Estado de Ocupación</label>
        <Dropdown id="ocupacion" v-model="formData.estado_ocupacion" :options="estadosOcupacion" placeholder="Seleccionar" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="medidor_agua" class="font-medium text-sm text-gray-700">Medidor Agua</label>
        <Dropdown id="medidor_agua" v-model="formData.id_medidor_agua" :options="medidoresAgua" optionLabel="codigo_medidor" optionValue="id" placeholder="Asignar Medidor" showClear />
      </div>
      <div class="flex flex-col gap-2">
        <label for="medidor_luz" class="font-medium text-sm text-gray-700">Medidor Luz</label>
        <Dropdown id="medidor_luz" v-model="formData.id_medidor_luz" :options="medidoresLuz" optionLabel="codigo_medidor" optionValue="id" placeholder="Asignar Medidor" showClear />
      </div>
    </div>

    <!-- Fila 5: Descripción -->
    <div class="flex flex-col gap-2">
      <label for="descripcion" class="font-medium text-sm text-gray-700">Notas Adicionales</label>
      <Textarea id="descripcion" v-model="formData.descripcion" rows="2" autoResize />
    </div>

    <!-- Fila 6: Estado (Soft Delete) -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Departamento Activo</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Registrar Departamento'" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from '../../store/useStore';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false }
});
const emit = defineEmits(['save', 'cancel']);
const store = useStore();

const edificios = ref([]);
const medidoresAgua = ref([]);
const medidoresLuz = ref([]);

const estadosOcupacion = ref(['DISPONIBLE', 'RESERVADO', 'OCUPADO', 'MANTENIMIENTO']);

onMounted(() => {
  edificios.value = store.state.edificios;
  // Solo medidores que no son generales
  medidoresAgua.value = store.state.medidores.filter(m => m.tipo_servicio === 'AGUA' && !m.es_general);
  medidoresLuz.value = store.state.medidores.filter(m => m.tipo_servicio === 'LUZ' && !m.es_general);
});

const formData = ref({
  id_edificio: null,
  numero_dpto: '',
  piso: 1,
  area_m2: 0,
  num_habitaciones: 1,
  num_banos: 1,
  descripcion: '',
  estado_ocupacion: 'DISPONIBLE',
  id_medidor_agua: null,
  id_medidor_luz: null,
  estado: 1
});

const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
  } else {
    formData.value = {
      id_edificio: null, numero_dpto: '', piso: 1, area_m2: 0, num_habitaciones: 1, 
      num_banos: 1, descripcion: '', estado_ocupacion: 'DISPONIBLE', id_medidor_agua: null, 
      id_medidor_luz: null, estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  const edif = edificios.value.find(e => e.id === formData.value.id_edificio);
  if (edif) {
    formData.value.nombre_edificio = edif.nombre;
  }
  emit('save', { ...formData.value });
};
</script>
