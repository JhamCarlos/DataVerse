<template>
  <form @submit.prevent="handleSubmit" class="flex flex-col gap-4">
    <!-- Fila 1: Medidor -->
    <div class="flex flex-col gap-2">
      <label for="medidor" class="font-medium text-sm text-gray-700">Medidor *</label>
      <Dropdown id="medidor" v-model="formData.id_medidor" :options="medidores" optionLabel="label" optionValue="id" filter placeholder="Seleccione Medidor" class="w-full" :disabled="isEditing" />
    </div>

    <!-- Fila 2: Periodo -->
    <div class="flex flex-col gap-2">
      <label for="periodo" class="font-medium text-sm text-gray-700">Periodo (YYYY-MM) *</label>
      <InputText id="periodo" v-model="formData.periodo" required placeholder="Ej. 2024-05" :disabled="isEditing" />
    </div>

    <!-- Fila 3: Lecturas -->
    <div class="grid grid-cols-1 md:grid-cols-2 gap-4">
      <div class="flex flex-col gap-2">
        <label for="lectura_anterior" class="font-medium text-sm text-gray-700">Lectura Anterior</label>
        <InputNumber id="lectura_anterior" v-model="formData.lectura_anterior" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" @input="calcularConsumo" />
      </div>
      <div class="flex flex-col gap-2">
        <label for="lectura_actual" class="font-medium text-sm text-gray-700">Lectura Actual *</label>
        <InputNumber id="lectura_actual" v-model="formData.lectura_actual" mode="decimal" :minFractionDigits="2" :maxFractionDigits="2" required @input="calcularConsumo" />
      </div>
    </div>

    <!-- Fila 4: Consumo Calculado -->
    <div class="flex flex-col gap-2 p-3 bg-blue-50 border border-blue-100 rounded-lg">
      <label class="font-medium text-sm text-blue-800">Consumo Calculado</label>
      <div class="text-xl font-bold text-blue-900">
        {{ formData.consumo.toFixed(2) }} <span class="text-sm font-normal text-blue-700">unidades</span>
      </div>
    </div>

    <!-- Fila 5: Estado -->
    <div class="flex items-center gap-3 mt-2">
      <InputSwitch inputId="estado" v-model="estadoBoolean" />
      <label for="estado" class="font-medium text-sm text-gray-700">Lectura Válida</label>
    </div>

    <!-- Botones -->
    <div class="flex justify-end gap-3 mt-4 pt-4 border-t border-gray-200">
      <Button type="button" label="Cancelar" severity="secondary" @click="$emit('cancel')" />
      <Button type="submit" :label="isEditing ? 'Guardar Cambios' : 'Registrar Lectura'" />
    </div>
  </form>
</template>

<script setup>
import { ref, watch, computed, onMounted } from 'vue';
import { useStore } from '../../../store/useStore';
import InputText from 'primevue/inputtext';
import InputNumber from 'primevue/inputnumber';
import Dropdown from 'primevue/dropdown';
import InputSwitch from 'primevue/inputswitch';
import Button from 'primevue/button';

const props = defineProps({
  initialData: { type: Object, default: () => ({}) },
  isEditing: { type: Boolean, default: false }
});

const emit = defineEmits(['save', 'cancel']);
const store = useStore();

const medidores = ref([]);

onMounted(() => {
  medidores.value = store.state.medidores.filter(m => m.estado === 1).map(m => {
    const e = store.state.edificios.find(ed => ed.id === m.id_edificio);
    return {
      ...m,
      label: `${m.codigo_medidor} - ${e ? e.nombre : ''} (${m.tipo_servicio})`
    };
  });
});

const formData = ref({
  id_medidor: null,
  periodo: '',
  lectura_anterior: 0,
  lectura_actual: 0,
  consumo: 0,
  estado: 1
});

const estadoBoolean = computed({
  get: () => formData.value.estado === 1,
  set: (val) => formData.value.estado = val ? 1 : 0
});

const calcularConsumo = () => {
  const anterior = formData.value.lectura_anterior || 0;
  const actual = formData.value.lectura_actual || 0;
  formData.value.consumo = Math.max(0, actual - anterior);
};

watch(() => props.initialData, (newVal) => {
  if (Object.keys(newVal).length > 0) {
    formData.value = { ...newVal };
  } else {
    formData.value = { id_medidor: null, periodo: '', lectura_anterior: 0, lectura_actual: 0, consumo: 0, estado: 1 };
  }
}, { immediate: true });

const handleSubmit = () => {
  // Asegurar cálculo final
  calcularConsumo();
  
  const m = medidores.value.find(x => x.id === formData.value.id_medidor);
  if (m) {
    formData.value.medidor_codigo = m.codigo_medidor;
  }
  
  emit('save', { ...formData.value });
};
</script>
