<template>
  <form @submit.prevent="handleSubmit" class="space-y-5">
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <!-- Payment Reference -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Referencia de Pago *
        </label>
        <input
          v-model="form.reference"
          type="text"
          placeholder="Ej: PAG-2024-001"
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

      <!-- Amount -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Monto *
        </label>
        <input
          v-model.number="form.amount"
          type="number"
          step="0.01"
          placeholder="Ej: 1200.00"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Payment Date -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Fecha de Pago *
        </label>
        <input
          v-model="form.date"
          type="date"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        />
      </div>

      <!-- Payment Method -->
      <div>
        <label class="block text-sm font-medium text-on-surface mb-2">
          Método de Pago *
        </label>
        <select
          v-model="form.method"
          required
          class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
        >
          <option value="">Seleccionar método</option>
          <option value="Transferencia">Transferencia Bancaria</option>
          <option value="Cheque">Cheque</option>
          <option value="Efectivo">Efectivo</option>
          <option value="Tarjeta">Tarjeta de Crédito</option>
          <option value="Otro">Otro</option>
        </select>
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
          <option value="Pendiente">Pendiente de Confirmación</option>
          <option value="Confirmado">Confirmado</option>
          <option value="Rechazado">Rechazado</option>
        </select>
      </div>
    </div>

    <!-- Payment Concept -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Concepto de Pago
      </label>
      <select
        v-model="form.concept"
        class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
      >
        <option value="">Seleccionar concepto</option>
        <option value="Renta">Renta Mensual</option>
        <option value="Depósito">Depósito</option>
        <option value="Servicios">Servicios Adicionales</option>
        <option value="Multa">Multa por Atraso</option>
        <option value="Otro">Otro</option>
      </select>
    </div>

    <!-- Transaction ID/Reference -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        ID de Transacción / Número de Comprobante
      </label>
      <input
        v-model="form.transactionId"
        type="text"
        placeholder="Ej: TRX-12345 o Comprobante: 00123456"
        class="w-full px-4 py-3 border border-outline-variant/30 rounded-lg bg-surface-container-lowest text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all"
      />
    </div>

    <!-- Notes -->
    <div>
      <label class="block text-sm font-medium text-on-surface mb-2">
        Notas
      </label>
      <textarea
        v-model="form.notes"
        placeholder="Observaciones adicionales sobre el pago..."
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
        Registrar Pago
      </button>
    </div>
  </form>
</template>

<script setup>
import { reactive } from 'vue';

const props = defineProps({
  payment: {
    type: Object,
    default: null,
  },
});

const emit = defineEmits(['submit', 'cancel']);

const form = reactive({
  reference: props.payment?.reference || '',
  tenant: props.payment?.tenant || '',
  department: props.payment?.department || '',
  amount: props.payment?.amount || '',
  date: props.payment?.date || '',
  method: props.payment?.method || '',
  status: props.payment?.status || 'Pendiente',
  concept: props.payment?.concept || 'Renta',
  transactionId: props.payment?.transactionId || '',
  notes: props.payment?.notes || '',
});

const handleSubmit = () => {
  emit('submit', { ...form });
  resetForm();
};

const resetForm = () => {
  form.reference = '';
  form.tenant = '';
  form.department = '';
  form.amount = '';
  form.date = '';
  form.method = '';
  form.status = 'Pendiente';
  form.concept = 'Renta';
  form.transactionId = '';
  form.notes = '';
};
</script>
