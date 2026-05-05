<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Contract Number -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Número de Contrato *
        </label>
        <input
          v-model="form.number"
          type="text"
          placeholder="Ej: CNT-2024-001"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Tenant -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Inquilino *
        </label>
        <select
          v-model="form.tenant"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        >
          <option value="">Seleccionar inquilino</option>
          <option value="Juan Pérez">Juan Pérez</option>
          <option value="María García">María García</option>
          <option value="Carlos López">Carlos López</option>
        </select>
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

      <!-- Start Date -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Fecha de Inicio *
        </label>
        <input
          v-model="form.startDate"
          type="date"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- End Date -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Fecha de Finalización *
        </label>
        <input
          v-model="form.endDate"
          type="date"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Deposit Amount -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Monto de Depósito
        </label>
        <input
          v-model.number="form.deposit"
          type="number"
          placeholder="Ej: 2400"
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
          <option value="Vigente">Vigente</option>
          <option value="Pendiente">Pendiente</option>
          <option value="Vencido">Vencido</option>
          <option value="Cancelado">Cancelado</option>
        </select>
      </div>
    </div>

    <!-- Terms & Conditions -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Términos y Condiciones
      </label>
      <textarea
        v-model="form.terms"
        placeholder="Términos y condiciones del contrato..."
        rows="4"
        class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
      ></textarea>
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Notas Adicionales
      </label>
      <textarea
        v-model="form.notes"
        placeholder="Notas..."
        rows="2"
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
        Guardar Contrato
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  contract: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  number: props.contract?.number || '',
  tenant: props.contract?.tenant || '',
  department: props.contract?.department || '',
  rent: props.contract?.rent || '',
  startDate: props.contract?.startDate || '',
  endDate: props.contract?.endDate || '',
  deposit: props.contract?.deposit || '',
  status: props.contract?.status || 'Vigente',
  terms: props.contract?.terms || '',
  notes: props.contract?.notes || '',
});

const handleSubmit = () => {
  emit('submit', { ...form });
  resetForm();
};

const resetForm = () => {
  form.number = '';
  form.tenant = '';
  form.department = '';
  form.rent = '';
  form.startDate = '';
  form.endDate = '';
  form.deposit = '';
  form.status = 'Vigente';
  form.terms = '';
  form.notes = '';
};
</script>
