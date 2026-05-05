<template>
  <div class="flex items-center justify-center min-h-screen bg-surface">
    <div class="text-center">
      <h1 class="text-6xl font-bold text-primary mb-4">404</h1>
      <h2 class="text-2xl font-bold text-on-surface mb-2">Página no encontrada</h2>
      <p class="text-on-surface-variant mb-8">
        La página que buscas no existe o ha sido movida.
      </p>
      <router-link
        to="/dashboard"
        class="inline-block px-6 py-3 bg-primary-container text-white rounded-lg font-bold hover:opacity-95 transition-all"
      >
        Volver al Dashboard
      </router-link>
    </div>
  </div>
</template>

<script setup>
</script>

<style scoped>
</style>
