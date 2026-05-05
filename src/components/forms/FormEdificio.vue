<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Nombre y Teléfono -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="nombre" class="font-medium text-sm text-gray-700">Nombre del Edificio *</label>
        <InputText id="nombre" v-model="formData.nombre" required placeholder="Ej. Edificio Las Palmas" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="telefono" class="font-medium text-sm text-gray-700">Teléfono de Contacto</label>
        <InputText id="telefono" v-model="formData.telefono_contacto" placeholder="Ej. 01 1234567" />
      </div>
    </div>

    <!-- Fila 2: Correo -->
    <div class="flex flex-col gap-2">
      <label for="correo" class="font-medium text-sm text-gray-700">Correo Electrónico</label>
      <InputText id="correo" type="email" v-model="formData.correo_contacto" placeholder="Ej. admin@edificio.com" />
    </div>

    <!-- Fila 3: Dirección -->
    <div class="flex flex-col gap-2">
      <label for="direccion" class="font-medium text-sm text-gray-700">Dirección Exacta *</label>
      <InputText id="direccion" v-model="formData.direccion" required placeholder="Av. Principal 123" />
    </div>

    <!-- Fila 4: Ubicación (Distrito, Provincia, Departamento) -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-4">
      <div class="flex flex-col gap-2">
        <label for="departamento" class="font-medium text-sm text-gray-700">Departamento</label>
        <InputText id="departamento" v-model="formData.departamento" placeholder="Lima" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="provincia" class="font-medium text-sm text-gray-700">Provincia</label>
        <InputText id="provincia" v-model="formData.provincia" placeholder="Lima" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="distrito" class="font-medium text-sm text-gray-700">Distrito</label>
        <InputText id="distrito" v-model="formData.distrito" placeholder="Miraflores" />
      </div>
    </div>

    <!-- Fila 5: Descripción -->
    <div class="flex flex-col gap-2">
      <label for="descripcion" class="font-medium text-sm text-gray-700">Descripción / Notas</label>
      <Textarea id="descripcion" v-model="formData.descripcion" rows="3" autoResize placeholder="Detalles adicionales del inmueble..." />
    </div>

    <!-- Fila 6: Estado -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Edificio Activo</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Registrar Edificio'" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed } from 'vue';
import InputText from 'primevue/inputtext';
import Textarea from 'primevue/textarea';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';

const props = defineProps({
  initialData: {
    type: Object,
    default: () => ({})
  },
  isEditing: {
    type: Boolean,
    default: false
  }
});

const emit = defineEmits(['save', 'cancel']);

// Estado local reactivo
const formData = ref({
  nombre: '',
  direccion: '',
  distrito: '',
  provincia: '',
  departamento: '',
  telefono_contacto: '',
  correo_contacto: '',
  descripcion: '',
  estado: 1
});

// Manejo del switch para estado (1 = true, 0 = false)
const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

// Al cargar o cambiar props.initialData, poblamos el form
watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
  } else {
    // Reset para nuevo registro
    formData.value = {
      nombre: '', direccion: '', distrito: '', provincia: '', departamento: '',
      telefono_contacto: '', correo_contacto: '', descripcion: '', estado: 1
    };
  }
}, { immediate: true });

const handleSubmit = () => {
  emit('save', { ...formData.value });
};
</script>
