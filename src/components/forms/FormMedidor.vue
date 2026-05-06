<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Edificio -->
    <div class="flex flex-col gap-2">
      <label for="edificio" class="font-medium text-sm text-gray-700">Edificio *</label>
      <Dropdown id="edificio" v-model="formData.id_edificio" :options="edificios" optionLabel="nombre" optionValue="id" placeholder="Seleccione Edificio" class="w-full" />
    </div>

    <!-- Fila 2: Código y Servicio -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="codigo" class="font-medium text-sm text-gray-700">Código del Medidor *</label>
        <InputText id="codigo" v-model="formData.codigo_medidor" required placeholder="Ej. MED-AGUA-001" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="servicio" class="font-medium text-sm text-gray-700">Tipo de Servicio *</label>
        <Dropdown id="servicio" v-model="formData.tipo_servicio" :options="tiposServicio" placeholder="Seleccionar Servicio" />
      </div>
    </div>

    <!-- Fila 3: Descripción -->
    <div class="flex flex-col gap-2">
      <label for="descripcion" class="font-medium text-sm text-gray-700">Descripción / Ubicación Físíca</label>
      <Textarea id="descripcion" v-model="formData.descripcion" rows="2" autoResize placeholder="Ej. Tablero principal del piso 1..." />
    </div>

    <!-- Fila 4: Flags Generales / Estado -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4 mt-2">
      <div class="flex items-center gap-3">
        <InputSwitch inputId="es_general" v-model="formData.es_general" />
        <label for="es_general" class="font-medium text-sm text-gray-700">Es Medidor General del Edificio</label>
      </div>
      <div class="flex items-center gap-3">
        <InputSwitch inputId="estado" v-model="estadoBoolean" />
        <label for="estado" class="font-medium text-sm text-gray-700">Medidor Activo</label>
      </div>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Registrar Medidor'" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from '../../store/useStore';
import InputText from 'primevue/inputtext';
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
const tiposServicio = ref(['AGUA', 'LUZ']);

onMounted(() => {
  edificios.value = store.state.edificios.filter(e => e.estado === 1);
});

const formData = ref({
  id_edificio: null,
  codigo_medidor: '',
  tipo_servicio: 'AGUA',
  es_general: false,
  descripcion: '',
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
      id_edificio: null, codigo_medidor: '', tipo_servicio: 'AGUA', es_general: false, descripcion: '', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  const edif = edificios.value.find(e => e.id === formData.value.id_edificio);
  if (edif) {
    formData.value.edificio_nombre = edif.nombre; // Añadido para mostrar en tabla fácilmente
  }
  emit('save', { ...formData.value });
};
</script>
