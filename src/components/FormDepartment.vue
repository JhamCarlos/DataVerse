<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Department Number -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Número de Departamento *
        </label>
        <input
          v-model="form.number"
          type="text"
          placeholder="Ej: 301"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Building/Location -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Edificio/Ubicación *
        </label>
        <input
          v-model="form.location"
          type="text"
          placeholder="Ej: Edificio A - Piso 3"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Area -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Área (m²) *
        </label>
        <input
          v-model.number="form.area"
          type="number"
          placeholder="Ej: 85"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Monthly Rent -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Renta Mensual *
        </label>
        <input
          v-model.number="form.rent"
          type="number"
          placeholder="Ej: 1200"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Tenant (Optional) -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Inquilino Actual
        </label>
        <input
          v-model="form.tenant"
          type="text"
          placeholder="Ej: Juan Pérez"
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Status -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Estado *
        </label>
        <select
          v-model="form.status"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        >
          <option value="">Seleccionar estado</option>
          <option value="Disponible">Disponible</option>
          <option value="Ocupado">Ocupado</option>
          <option value="Mantenimiento">Mantenimiento</option>
        </select>
      </div>
    </div>

    <!-- Description -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Descripción
      </label>
      <textarea
        v-model="form.description"
        placeholder="Detalles adicionales del departamento..."
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
        Guardar Departamento
      </button>
    </div>
  </form>
</template>

<script setup>
import { ref, reactive } from 'vue';

const props = defineProps({
  department: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  number: props.department?.number || '',
  location: props.department?.location || '',
  area: props.department?.area || '',
  rent: props.department?.rent || '',
  tenant: props.department?.tenant || '',
  status: props.department?.status || '',
  description: props.department?.description || '',
});

const handleSubmit = () => {
  emit('submit', { ...form });
  resetForm();
};

const resetForm = () => {
  form.number = '';
  form.location = '';
  form.area = '';
  form.rent = '';
  form.tenant = '';
  form.status = '';
  form.description = '';
};
</script>
