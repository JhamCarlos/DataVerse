<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Topbar -->
    <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20">
      <div class="flex items-center gap-4">
        <i class="pi pi-building text-primary text-2xl"></i>
        <h1 class="text-xl font-bold text-gray-800">Dataverse Rentals <span class="text-sm font-normal text-gray-500">Admin</span></h1>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium">{{ store.state.currentUser?.nombre_completo }}</span>
        <Button icon="pi pi-sign-out" text rounded severity="secondary" @click="handleLogout" />
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <nav class="p-4 space-y-1">
          <router-link to="/admin/dashboard" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-home"></i> <span>Dashboard</span>
          </router-link>

          <div class="pt-4 pb-2"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Inmuebles</p></div>
          <router-link to="/admin/edificios" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-building"></i> <span>Edificios</span>
          </router-link>
          <router-link to="/admin/departamentos" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-th-large"></i> <span>Departamentos</span>
          </router-link>
          <router-link to="/admin/medidores" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-gauge"></i> <span>Medidores</span>
          </router-link>

          <div class="pt-4 pb-2"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Arrendamiento</p></div>
          <router-link to="/admin/inquilinos" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-users"></i> <span>Inquilinos</span>
          </router-link>
          <router-link to="/admin/contratos" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-file"></i> <span>Contratos</span>
          </router-link>
          <router-link to="/admin/alertas" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-bell"></i> <span>Alertas de Vencimiento</span>
          </router-link>

          <div class="pt-4 pb-2"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Servicios</p></div>
          <router-link to="/admin/tarifas" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-dollar"></i> <span>Tarifas</span>
          </router-link>
          <router-link to="/admin/lecturas" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-chart-bar"></i> <span>Lecturas</span>
          </router-link>

          <div class="pt-4 pb-2"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Finanzas</p></div>
          <router-link to="/admin/boletas" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-receipt"></i> <span>Boletas</span>
          </router-link>
          <router-link to="/admin/pagos" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-wallet"></i> <span>Pagos</span>
          </router-link>

          <div class="pt-4 pb-2"><p class="text-xs font-semibold text-gray-400 uppercase tracking-wider">Mantenimiento</p></div>
          <router-link to="/admin/personal" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-user-plus"></i> <span>Personal Técnico</span>
          </router-link>
          <router-link to="/admin/gastos" class="flex items-center gap-3 px-3 py-2 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-blue-50 text-blue-700 font-semibold">
            <i class="pi pi-wrench"></i> <span>Gastos Operativos</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-6">
        <router-view />
      </main>
    </div>
  </div>
</template>

<script setup>
import { useRouter } from 'vue-router';
import { useStore } from '../../store/useStore';
import Button from 'primevue/button';

const router = useRouter();
const store = useStore();

const handleLogout = () => {
  store.logout();
  router.push('/login');
};
</script>
