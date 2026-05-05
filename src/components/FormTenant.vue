<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Full Name -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Nombre Completo *
        </label>
        <input
          v-model="form.name"
          type="text"
          placeholder="Ej: Juan Pérez García"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Email -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Email *
        </label>
        <input
          v-model="form.email"
          type="email"
          placeholder="Ej: juan@example.com"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Phone -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Teléfono *
        </label>
        <input
          v-model="form.phone"
          type="tel"
          placeholder="Ej: +34 600 123 456"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Department -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Departamento *
        </label>
        <select
          v-model="form.department"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        >
          <option value="">Seleccionar departamento</option>
          <option value="301">301</option>
          <option value="302">302</option>
          <option value="401">401</option>
          <option value="402">402</option>
        </select>
      </div>

      <!-- ID Type -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Tipo de Identificación
        </label>
        <select
          v-model="form.idType"
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        >
          <option value="">Seleccionar tipo</option>
          <option value="DNI">DNI</option>
          <option value="Pasaporte">Pasaporte</option>
          <option value="NIT">NIT</option>
        </select>
      </div>

      <!-- ID Number -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Número de Identificación
        </label>
        <input
          v-model="form.idNumber"
          type="text"
          placeholder="Ej: 12345678A"
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>
    </div>

    <!-- Address -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Dirección
      </label>
      <input
        v-model="form.address"
        type="text"
        placeholder="Dirección completa"
        class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
      />
    </div>

    <!-- Status -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Estado
      </label>
      <select
        v-model="form.status"
        class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
      >
        <option value="">Seleccionar estado</option>
        <option value="Activo">Activo</option>
        <option value="Inactivo">Inactivo</option>
        <option value="Suspendido">Suspendido</option>
      </select>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Notas
      </label>
      <textarea
        v-model="form.notes"
        placeholder="Notas adicionales sobre el inquilino..."
        rows="3"
        class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
      ></textarea>
    </div>

    <!-- Form Actions -->
    <div class="flex gap-3 pt-4">
      <button
        type="button"
        @click="$emit('cancel')"
        class="flex-1 px-6 py-3 border border-outline-variant/30 rounded-lg text-on-surface font-medium hover:bg-surface-container transition-colors"
      >
        Cancelar
      </button>
      <button
        type="submit"
        class="flex-1 px-6 py-3 bg-primary text-white rounded-lg font-medium hover:opacity-95 transition-opacity"
      >
        Guardar Inquilino
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  tenant: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  name: props.tenant?.name || '',
  email: props.tenant?.email || '',
  phone: props.tenant?.phone || '',
  department: props.tenant?.department || '',
  idType: props.tenant?.idType || '',
  idNumber: props.tenant?.idNumber || '',
  address: props.tenant?.address || '',
  status: props.tenant?.status || 'Activo',
  notes: props.tenant?.notes || '',
});

const handleSubmit = () => {
  emit('submit', { ...form });
  resetForm();
};

const resetForm = () => {
  form.name = '';
  form.email = '';
  form.phone = '';
  form.department = '';
  form.idType = '';
  form.idNumber = '';
  form.address = '';
  form.status = 'Activo';
  form.notes = '';
};
</script>
