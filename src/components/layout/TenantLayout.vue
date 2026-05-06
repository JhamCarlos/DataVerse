<template>
  <div class="flex flex-col h-screen bg-gray-50">
    <!-- Topbar -->
    <header class="bg-white border-b border-gray-200 h-16 flex items-center justify-between px-6 z-20 shadow-sm">
      <div class="flex items-center gap-4">
        <i class="pi pi-building text-green-600 text-2xl"></i>
        <h1 class="text-xl font-bold text-gray-800">Mi Departamento <span class="text-sm font-normal text-gray-500">Portal Inquilino</span></h1>
      </div>
      <div class="flex items-center gap-4">
        <span class="text-sm font-medium">{{ store.state.currentUser?.nombre_completo }}</span>
        <Button icon="pi pi-sign-out" text rounded severity="secondary" @click="handleLogout" />
      </div>
    </header>

    <div class="flex flex-1 overflow-hidden">
      <!-- Sidebar -->
      <aside class="w-64 bg-white border-r border-gray-200 overflow-y-auto">
        <nav class="p-4 space-y-2">
          <router-link to="/tenant/dashboard" class="flex items-center gap-3 px-3 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-green-50 text-green-700 font-semibold">
            <i class="pi pi-home"></i>
            <span>Mi Inicio</span>
          </router-link>
          
          <router-link to="/tenant/boletas" class="flex items-center gap-3 px-3 py-3 rounded-md text-gray-700 hover:bg-gray-100 transition-colors" active-class="bg-green-50 text-green-700 font-semibold">
            <i class="pi pi-receipt"></i>
            <span>Mis Boletas</span>
          </router-link>
        </nav>
      </aside>

      <!-- Main content -->
      <main class="flex-1 overflow-y-auto p-6 bg-gray-50">
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
