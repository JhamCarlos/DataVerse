<template>
  <div class="flex flex-col h-screen bg-surface">
    <!-- Sidebar (Desktop NavigationDrawer) -->
    <aside
      class="h-screen w-64 fixed left-0 top-0 hidden md:flex flex-col bg-[#f0f4fa] font-inter text-sm tracking-wide z-50 border-r border-outline-variant/20"
    >
      <div class="flex flex-col h-full py-6 px-4">
        <!-- Branding -->
        <div class="mb-8 px-4">
          <h1 class="text-xl font-bold text-[#1f4e79]">Dataverse Rentals</h1>
          <p class="text-xs text-[#516072] mt-1 uppercase tracking-widest">
            Corporate Admin
          </p>
        </div>

        <!-- Navigation Menu -->
        <nav class="flex-1 space-y-1">
          <router-link
            v-for="item in menuItems"
            :key="item.id"
            :to="item.path"
            class="flex items-center gap-3 px-4 py-3 rounded-lg transition-colors"
            :class="[
              isActive(item.path)
                ? 'text-[#1f4e79] font-bold bg-[#e6e8eb]'
                : 'text-[#516072] hover:text-[#1f4e79] hover:bg-[#e6e8eb]',
            ]"
          >
            <span class="material-symbols-outlined text-[20px]">
              {{ item.icon }}
            </span>
            <span>{{ item.label }}</span>
          </router-link>
        </nav>

        <!-- User Profile -->
        <div
          class="mt-auto px-4 py-4 flex items-center gap-3 border-t border-outline-variant/20"
        >
          <img
            alt="Admin User"
            class="w-8 h-8 rounded-full object-cover bg-primary-container"
            src="https://ui-avatars.com/api/?name=Admin+User&background=00375e&color=fff"
          />
          <div>
            <p class="font-bold text-primary">Admin User</p>
            <p class="text-[10px] text-on-surface-variant">v2.4.0</p>
          </div>
        </div>
      </div>
    </aside>

    <!-- Main Content Area -->
    <div class="flex flex-col flex-1 md:ml-64">
      <!-- TopAppBar -->
      <header
        class="sticky top-0 z-40 bg-white/80 dark:bg-slate-900/80 backdrop-blur-md border-b border-outline-variant/20"
      >
        <div class="flex justify-between items-center px-6 py-4">
          <div class="flex items-center gap-4">
            <button class="material-symbols-outlined text-primary md:hidden">
              menu
            </button>
            <h2 class="font-inter text-lg font-semibold text-primary">
              <slot name="title">Dashboard</slot>
            </h2>
          </div>
          <div class="flex items-center gap-6">
            <button class="relative text-primary">
              <span class="material-symbols-outlined">notify</span>
              <span class="absolute -top-1 -right-1 w-2 h-2 bg-error rounded-full"></span>
            </button>
            <button class="text-primary">
              <span class="material-symbols-outlined">account_circle</span>
            </button>
          </div>
        </div>
      </header>

      <!-- Content -->
      <main class="flex-1 overflow-auto p-6 lg:p-8">
        <slot></slot>
      </main>
    </div>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRoute } from 'vue-router';

const route = useRoute();

const menuItems = ref([
  { id: 1, label: 'Dashboard', icon: 'dashboard', path: '/dashboard' },
  { id: 2, label: 'Departmentos', icon: 'domain', path: '/departments' },
  { id: 3, label: 'Inquilinos', icon: 'group', path: '/tenants' },
  { id: 4, label: 'Contratos', icon: 'description', path: '/contracts' },
  { id: 5, label: 'Lectura', icon: 'analytics', path: '/readings' },
  { id: 6, label: 'Liquidaciones', icon: 'receipt_long', path: '/settlements' },
  { id: 7, label: 'Pagos', icon: 'payments', path: '/payments' },
  { id: 8, label: 'Ajustes', icon: 'settings', path: '/settings' },
]);

const isActive = (path) => {
  return route.path === path;
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
