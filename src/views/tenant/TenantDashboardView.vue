<template>
  <div class="space-y-6">
    <!-- Header -->
    <div class="flex flex-col md:flex-row md:items-center justify-between gap-4">
      <div>
        <h2 class="text-3xl font-extrabold text-gray-900 tracking-tight">
          ¡Hola, {{ store.state.currentUser?.nombre_completo.split(' ')[0] }}! 👋
        </h2>
        <p class="text-gray-500 text-lg mt-1">Bienvenido a tu portal de inquilino. Aquí tienes el resumen de tu cuenta.</p>
      </div>
      <div class="bg-green-100 px-4 py-2 rounded-full border border-green-200 flex items-center gap-2">
        <span class="relative flex h-3 w-3">
          <span class="animate-ping absolute inline-flex h-full w-full rounded-full bg-green-400 opacity-75"></span>
          <span class="relative inline-flex rounded-full h-3 w-3 bg-green-500"></span>
        </span>
        <span class="text-green-800 font-semibold text-sm">Contrato Vigente</span>
      </div>
    </div>

    <!-- Stats Cards -->
    <div class="grid grid-cols-1 md:grid-cols-3 gap-6">
      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-blue-50 rounded-xl flex items-center justify-center text-blue-600">
            <i class="pi pi-calendar text-2xl"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Próximo Vencimiento</p>
            <p class="text-2xl font-bold text-gray-900">{{ proximaFechaVencimiento }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-orange-50 rounded-xl flex items-center justify-center text-orange-600">
            <i class="pi pi-wallet text-2xl"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Monto a Pagar</p>
            <p class="text-2xl font-bold text-gray-900">${{ montoPendiente.toFixed(2) }}</p>
          </div>
        </div>
      </div>

      <div class="bg-white p-6 rounded-2xl border border-gray-100 shadow-sm hover:shadow-md transition-shadow">
        <div class="flex items-center gap-4">
          <div class="w-12 h-12 bg-purple-50 rounded-xl flex items-center justify-center text-purple-600">
            <i class="pi pi-home text-2xl"></i>
          </div>
          <div>
            <p class="text-sm font-medium text-gray-500 uppercase tracking-wider">Departamento</p>
            <p class="text-xl font-bold text-gray-900 truncate max-w-[150px]">{{ departamentoInfo }}</p>
          </div>
        </div>
      </div>
    </div>

    <!-- Main Content Grid -->
    <div class="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <!-- Última Boleta Emite -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <div class="flex items-center justify-between mb-6">
          <h3 class="text-xl font-bold text-gray-800">Última Boleta</h3>
          <router-link to="/tenant/boletas" class="text-sm text-green-600 font-semibold hover:underline">Ver todas</router-link>
        </div>
        
        <div v-if="ultimaBoleta" class="space-y-4">
          <div class="flex justify-between p-4 bg-gray-50 rounded-xl border border-gray-100">
            <div>
              <p class="text-xs text-gray-500 uppercase font-bold tracking-widest">Periodo</p>
              <p class="text-lg font-bold text-gray-800">{{ ultimaBoleta.periodo }}</p>
            </div>
            <div class="text-right">
              <p class="text-xs text-gray-500 uppercase font-bold tracking-widest">Estado</p>
              <span :class="ultimaBoleta.estado_boleta === 'PAGADA' ? 'text-green-600' : 'text-orange-600'" class="text-sm font-extrabold">
                {{ ultimaBoleta.estado_boleta }}
              </span>
            </div>
          </div>

          <div class="space-y-3 px-2">
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Alquiler</span>
              <span class="font-semibold">${{ ultimaBoleta.monto_alquiler.toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Servicios (Agua/Luz)</span>
              <span class="font-semibold">${{ (ultimaBoleta.monto_agua + ultimaBoleta.monto_luz).toFixed(2) }}</span>
            </div>
            <div class="flex justify-between text-sm">
              <span class="text-gray-600">Mantenimiento</span>
              <span class="font-semibold">${{ ultimaBoleta.monto_mantenimiento.toFixed(2) }}</span>
            </div>
            <div class="border-t pt-3 flex justify-between">
              <span class="font-bold text-gray-800">TOTAL</span>
              <span class="font-extrabold text-xl text-primary">${{ ultimaBoleta.monto_total.toFixed(2) }}</span>
            </div>
          </div>

          <div class="pt-4 flex gap-3">
            <Button label="Descargar PDF" icon="pi pi-file-pdf" class="p-button-outlined p-button-secondary flex-1" />
            <Button v-if="ultimaBoleta.estado_boleta === 'PENDIENTE'" label="Pagar Ahora" icon="pi pi-credit-card" class="p-button-success flex-1" />
          </div>
        </div>
        <div v-else class="text-center py-12 text-gray-400">
          No hay boletas registradas aún.
        </div>
      </div>

      <!-- Consumo de Servicios (Simulado) -->
      <div class="bg-white p-6 rounded-2xl border border-gray-200 shadow-sm">
        <h3 class="text-xl font-bold text-gray-800 mb-6">Consumo de Servicios</h3>
        <div class="space-y-6">
          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-600 flex items-center gap-2">
                <i class="pi pi-bolt text-yellow-500"></i> Electricidad
              </span>
              <span class="text-sm font-bold text-gray-800">150 kWh</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5">
              <div class="bg-yellow-500 h-2.5 rounded-full" style="width: 70%"></div>
            </div>
          </div>

          <div>
            <div class="flex justify-between mb-2">
              <span class="text-sm font-medium text-gray-600 flex items-center gap-2">
                <i class="pi pi-tint text-blue-500"></i> Agua
              </span>
              <span class="text-sm font-bold text-gray-800">50 m³</span>
            </div>
            <div class="w-full bg-gray-100 rounded-full h-2.5">
              <div class="bg-blue-500 h-2.5 rounded-full" style="width: 45%"></div>
            </div>
          </div>

          <div class="bg-blue-50 p-4 rounded-xl border border-blue-100 mt-8">
            <h4 class="text-sm font-bold text-blue-800 mb-2 flex items-center gap-2">
              <i class="pi pi-info-circle"></i> Consejos de Ahorro
            </h4>
            <p class="text-xs text-blue-700 leading-relaxed">
              Tu consumo de agua este mes es un 10% menor al anterior. ¡Sigue así para reducir tu próxima boleta!
            </p>
          </div>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup>
import { computed } from 'vue';
import { useStore } from '../../store/useStore';
import Button from 'primevue/button';

const store = useStore();
const currentInquilinoId = store.state.currentUser?.id_inquilino;

const misBoletas = computed(() => {
  if (!currentInquilinoId) return [];
  // Buscamos contratos del inquilino
  const misContratosIds = store.state.contratos
    .filter(c => c.id_inquilino === currentInquilinoId)
    .map(c => c.id);
  
  return store.state.boletas.filter(b => misContratosIds.includes(b.id_contrato));
});

const ultimaBoleta = computed(() => {
  if (misBoletas.value.length === 0) return null;
  return misBoletas.value.sort((a, b) => b.id - a.id)[0];
});

const montoPendiente = computed(() => {
  return misBoletas.value
    .filter(b => b.estado_boleta === 'PENDIENTE')
    .reduce((acc, b) => acc + b.monto_total, 0);
});

const proximaFechaVencimiento = computed(() => {
  const pendiente = misBoletas.value.find(b => b.estado_boleta === 'PENDIENTE');
  return pendiente ? pendiente.fecha_vencimiento : 'Sin deudas';
});

const departamentoInfo = computed(() => {
  const contrato = store.state.contratos.find(c => c.id_inquilino === currentInquilinoId);
  return contrato ? contrato.departamento_numero : 'No asignado';
});
</script>
