<template>
  <div class="p-fluid">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="field col-span-2">
        <label for="nombre_completo" class="font-bold block mb-2">Nombre Completo</label>
        <InputText id="nombre_completo" v-model="formData.nombre_completo" required autofocus :class="{'p-invalid': submitted && !formData.nombre_completo}" />
        <small class="p-error" v-if="submitted && !formData.nombre_completo">Nombre es requerido.</small>
      </div>
      
      <div class="field">
        <label for="username" class="font-bold block mb-2">Nombre de Usuario</label>
        <InputText id="username" v-model="formData.username" required :class="{'p-invalid': submitted && !formData.username}" />
        <small class="p-error" v-if="submitted && !formData.username">Username es requerido.</small>
      </div>

      <div class="field">
        <label for="role" class="font-bold block mb-2">Rol / Perfil</label>
        <Dropdown id="role" v-model="formData.role" :options="roles" optionLabel="label" optionValue="value" placeholder="Seleccione un Rol" />
      </div>

      <div class="field col-span-2">
        <label for="correo" class="font-bold block mb-2">Correo Electrónico</label>
        <InputText id="correo" v-model="formData.correo" required :class="{'p-invalid': submitted && !formData.correo}" />
        <small class="p-error" v-if="submitted && !formData.correo">Correo es requerido.</small>
      </div>

      <div class="field col-span-2" v-if="!isEditing">
        <label for="password" class="font-bold block mb-2">Contraseña Temporal</label>
        <Password id="password" v-model="formData.password" toggleMask :feedback="false" />
        <small class="text-gray-500">El usuario deberá cambiarla al primer ingreso.</small>
      </div>
    </div>

    <div class="flex justify-end mt-6 gap-2">
      <Button label="Cancelar" icon="pi pi-times" text @click="$emit('cancel')" />
      <Button label="Guardar Usuario" icon="pi pi-check" @click="handleSave" />
    </div>
  </div>
</template>

<script setup>
import { ref, watch } from 'vue';
import InputText from 'primevue/inputtext';
import Dropdown from 'primevue/dropdown';
import Password from 'primevue/password';
import Button from 'primevue/button';

const props = defineProps({
  initialData: Object,
  isEditing: Boolean
});

const emit = defineEmits(['save', 'cancel']);

const formData = ref({ ...props.initialData });
const submitted = ref(false);

const roles = [
  { label: 'Administrador', value: 'ADMIN' },
  { label: 'Inquilino', value: 'INQUILINO' },
  { label: 'Personal Técnico', value: 'OPERARIO' }
];

watch(() => props.initialData, (newData) => {
  formData.value = { ...newData };
}, { deep: true });

const handleSave = () => {
  submitted.value = true;
  
  if (formData.value.nombre_completo && formData.value.username && formData.value.correo) {
    emit('save', { ...formData.value });
  }
};
</script>
