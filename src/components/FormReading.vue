<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
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

      <!-- Meter Type -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Tipo de Medidor *
        </label>
        <select
          v-model="form.type"
          required
          @change="form.unit = getUnitForType(form.type)"
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        >
          <option value="">Seleccionar tipo</option>
          <option value="Agua">Agua</option>
          <option value="Electricidad">Electricidad</option>
          <option value="Gas">Gas</option>
        </select>
      </div>

      <!-- Reading Date -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Fecha de Lectura *
        </label>
        <input
          v-model="form.date"
          type="date"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Meter ID/Serial -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Número de Medidor
        </label>
        <input
          v-model="form.meterId"
          type="text"
          placeholder="Ej: MED-001-A"
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Previous Reading -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Lectura Anterior *
        </label>
        <input
          v-model.number="form.previousReading"
          type="number"
          placeholder="Ej: 1500"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Current Reading -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Lectura Actual *
        </label>
        <input
          v-model.number="form.currentReading"
          type="number"
          placeholder="Ej: 1750"
          required
          @change="calculateConsumption"
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Unit -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Unidad de Medida
        </label>
        <input
          v-model="form.unit"
          type="text"
          disabled
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container/50 text-on-surface-variant cursor-not-allowed"
        />
      </div>

      <!-- Consumption -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Consumo Calculado
        </label>
        <input
          v-model.number="form.consumption"
          type="number"
          disabled
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container/50 text-on-surface-variant cursor-not-allowed"
        />
      </div>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Observaciones
      </label>
      <textarea
        v-model="form.notes"
        placeholder="Notas sobre la lectura, anomalías, etc..."
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
        Guardar Lectura
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  reading: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  department: props.reading?.department || '',
  type: props.reading?.type || '',
  date: props.reading?.date || '',
  meterId: props.reading?.meterId || '',
  previousReading: props.reading?.previousReading || '',
  currentReading: props.reading?.currentReading || '',
  unit: props.reading?.unit || '',
  consumption: props.reading?.consumption || 0,
  notes: props.reading?.notes || '',
});

const getUnitForType = (type) => {
  const units = {
    'Agua': 'm³',
    'Electricidad': 'kWh',
    'Gas': 'm³',
  };
  return units[type] || '';
};

const calculateConsumption = () => {
  if (form.currentReading && form.previousReading) {
    form.consumption = form.currentReading - form.previousReading;
  }
};

const handleSubmit = () => {
  emit('submit', { ...form });
  resetForm();
};

const resetForm = () => {
  form.department = '';
  form.type = '';
  form.date = '';
  form.meterId = '';
  form.previousReading = '';
  form.currentReading = '';
  form.unit = '';
  form.consumption = 0;
  form.notes = '';
};
</script>
