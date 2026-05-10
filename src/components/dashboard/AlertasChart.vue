<template>
  <div class="bg-white border border-gray-200 rounded-xl p-6 shadow-sm">
    <h3 class="text-lg font-bold text-gray-800 mb-4">Alertas y Avisos</h3>
    
    <div v-if="alertas.length === 0" class="text-center py-8">
      <i class="pi pi-check-circle text-4xl text-green-500 mb-3"></i>
      <p class="text-gray-600">Sin alertas críticas</p>
    </div>
    
    <div v-else class="space-y-3">
      <div
        v-for="alerta in alertas"
        :key="alerta.id"
        :class="['p-4 rounded-lg border-l-4 flex items-start gap-3', alerta.tipo === 'CRITICA' ? 'bg-red-50 border-l-red-500' : alerta.tipo === 'ADVERTENCIA' ? 'bg-yellow-50 border-l-yellow-500' : 'bg-blue-50 border-l-blue-500']"
      >
        <i
          :class="[
            'pi text-lg flex-shrink-0 mt-0.5',
            alerta.tipo === 'CRITICA' ? 'pi-exclamation-circle text-red-600' : alerta.tipo === 'ADVERTENCIA' ? 'pi-alert text-yellow-600' : 'pi-info-circle text-blue-600'
          ]"
        ></i>
        <div class="flex-1">
          <p :class="['font-semibold', alerta.tipo === 'CRITICA' ? 'text-red-900' : alerta.tipo === 'ADVERTENCIA' ? 'text-yellow-900' : 'text-blue-900']">
            {{ alerta.titulo }}
          </p>
          <p :class="['text-sm mt-1', alerta.tipo === 'CRITICA' ? 'text-red-700' : alerta.tipo === 'ADVERTENCIA' ? 'text-yellow-700' : 'text-blue-700']">
            {{ alerta.descripcion }}
          </p>
        </div>
        <button
          @click="cerrarAlerta(alerta.id)"
          class="text-gray-400 hover:text-gray-600 flex-shrink-0"
        >
          <i class="pi pi-times text-lg"></i>
        </button>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed } from 'vue';
import { useStore } from '../../store/useStore';

const store = useStore();
const alertasCerradas = ref([]);

const alertas = computed(() => {
  const nuevasAlertas = [];
  
  // Alerta de morosidad
  if (store.morosidad.value > 5000) {
    nuevasAlertas.push({
      id: 1,
      tipo: 'CRITICA',
      titulo: 'Morosidad Crítica',
      descripcion: `Hay ${store.boletasPendientes.value} boletas vencidas por un monto de ${formatCurrency(store.morosidad.value)}. Requiere acción inmediata.`
    });
  }
  
  // Alerta de baja ocupación
  if (store.ocupacion.value < 50) {
    nuevasAlertas.push({
      id: 2,
      tipo: 'ADVERTENCIA',
      titulo: 'Baja Ocupación',
      descripcion: `Solo ${store.ocupacion.value}% de los departamentos están ocupados. Hay ${store.departamentosDisponibles.value} departamentos disponibles.`
    });
  }
  
  // Alerta de ingresos bajo
  if (store.ingresos.value < 10000) {
    nuevasAlertas.push({
      id: 3,
      tipo: 'ADVERTENCIA',
      titulo: 'Ingresos Bajos',
      descripcion: `Los ingresos procesados son solo ${formatCurrency(store.ingresos.value)}. Consideran los pagos pendientes: ${formatCurrency(12080)}.`
    });
  }
  
  return nuevasAlertas.filter(a => !alertasCerradas.value.includes(a.id));
});

const formatCurrency = (value) => {
  return new Intl.NumberFormat('es-PE', {
    style: 'currency',
    currency: 'PEN'
  }).format(value);
};

const cerrarAlerta = (id) => {
  alertasCerradas.value.push(id);
};
</script>
