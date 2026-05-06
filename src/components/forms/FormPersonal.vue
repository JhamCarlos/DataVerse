<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Nombres y Apellidos -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="nombres" class="font-medium text-sm text-gray-700">Nombres *</label>
        <InputText id="nombres" v-model="formData.nombres" required placeholder="Nombres del personal" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="apellidos" class="font-medium text-sm text-gray-700">Apellidos *</label>
        <InputText id="apellidos" v-model="formData.apellido_paterno" required placeholder="Apellidos" />
      </div>
    </div>

    <!-- Fila 2: Documento de Identidad -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="tipo_doc" class="font-medium text-sm text-gray-700">Tipo de Documento *</label>
        <Dropdown id="tipo_doc" v-model="formData.tipo_documento" :options="tiposDocumento" placeholder="Seleccione Tipo" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="num_doc" class="font-medium text-sm text-gray-700">Número de Documento *</label>
        <InputText id="num_doc" v-model="formData.numero_documento" required placeholder="Ej. 12345678" />
      </div>
    </div>

    <!-- Fila 3: Especialidad -->
    <div class="flex flex-col gap-2">
      <label for="especialidad" class="font-medium text-sm text-gray-700">Especialidad Técnica *</label>
      <Dropdown id="especialidad" v-model="formData.especialidad" :options="especialidades" placeholder="Seleccione una especialidad" class="w-full" />
    </div>

    <!-- Fila 4: Estado Lógico (Soft Delete) -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Personal Activo</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Registrar Personal'" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false }
});

const emit = defineEmits(['save', 'cancel']);

const tiposDocumento = ref(['DNI', 'CE', 'PASAPORTE']);
const especialidades = ref(['GASFITERIA', 'ELECTRICIDAD', 'LIMPIEZA', 'CONSERJERIA', 'SEGURIDAD', 'MANTENIMIENTO_GENERAL']);

const formData = ref({
  nombres: '',
  apellido_paterno: '',
  tipo_documento: 'DNI',
  numero_documento: '',
  especialidad: '',
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
      nombres: '', apellido_paterno: '', tipo_documento: 'DNI',
      numero_documento: '', especialidad: '', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { ...formData.value });
};
</script>
