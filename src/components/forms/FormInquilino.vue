<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Documento -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="tipoDoc" class="font-medium text-sm text-gray-700">Tipo de Documento *</label>
        <Dropdown id="tipoDoc" v-model="formData.tipo_documento" :options="tiposDocumento" placeholder="Seleccione Tipo" class="w-full" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="numDoc" class="font-medium text-sm text-gray-700">Número de Documento *</label>
        <InputText id="numDoc" v-model="formData.numero_documento" required placeholder="Ej. 74839210" />
      </div>
    </div>

    <!-- Fila 2: Nombres y Apellidos -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="nombres" class="font-medium text-sm text-gray-700">Nombres *</label>
        <InputText id="nombres" v-model="formData.nombres" required placeholder="Nombres" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="apePat" class="font-medium text-sm text-gray-700">Apellido Paterno *</label>
        <InputText id="apePat" v-model="formData.apellido_paterno" required placeholder="Paterno" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="apeMat" class="font-medium text-sm text-gray-700">Apellido Materno *</label>
        <InputText id="apeMat" v-model="formData.apellido_materno" required placeholder="Materno" />
      </div>
    </div>

    <!-- Fila 3: Contacto -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="telefono" class="font-medium text-sm text-gray-700">Teléfono *</label>
        <InputText id="telefono" v-model="formData.telefono" required placeholder="Ej. 987654321" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="correo" class="font-medium text-sm text-gray-700">Correo Electrónico *</label>
        <InputText id="correo" type="email" v-model="formData.correo" required placeholder="usuario@email.com" />
      </div>
    </div>

    <!-- Fila 4: Estado (Soft Delete) -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Inquilino Activo</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Registrar Inquilino'" />
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

const tiposDocumento = ref(['DNI', 'CE', 'PASAPORTE', 'RUC']);

const formData = ref({
  tipo_documento: 'DNI',
  numero_documento: '',
  nombres: '',
  apellido_paterno: '',
  apellido_materno: '',
  telefono: '',
  correo: '',
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
      tipo_documento: 'DNI', numero_documento: '', nombres: '', apellido_paterno: '', apellido_materno: '', telefono: '', correo: '', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { ...formData.value });
};
</script>
