<template>
  <DashboardLayout>
    <div class="max-w-7xl mx-auto">
      <h1 class="text-3xl font-bold text-primary mb-8">Configuración</h1>

      <div class="grid grid-cols-1 lg:grid-cols-3 gap-6">
        <!-- Settings Sections -->
        <div class="lg:col-span-2 space-y-6">
          <!-- Company Info -->
          <div
            class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6"
          >
            <h3 class="text-lg font-bold text-primary mb-4">Información de la Empresa</h3>
            <div class="space-y-4">
              <div>
                <label class="block text-sm font-medium text-on-surface mb-2">
                  Nombre
                </label>
                <input
                  type="text"
                  value="Dataverse Rentals"
                  class="w-full px-4 py-2 border border-outline-variant/30 rounded-lg text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-on-surface mb-2">
                  Email
                </label>
                <input
                  type="email"
                  value="info@dataverserentals.com"
                  class="w-full px-4 py-2 border border-outline-variant/30 rounded-lg text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary"
                />
              </div>
              <div>
                <label class="block text-sm font-medium text-on-surface mb-2">
                  Teléfono
                </label>
                <input
                  type="tel"
                  value="+56 2 1234 5678"
                  class="w-full px-4 py-2 border border-outline-variant/30 rounded-lg text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary"
                />
              </div>
            </div>
          </div>

          <!-- Notification Settings -->
          <div
            class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6"
          >
            <h3 class="text-lg font-bold text-primary mb-4">Notificaciones</h3>
            <div class="space-y-3">
              <div class="flex items-center">
                <input type="checkbox" id="email-notif" checked class="rounded" />
                <label for="email-notif" class="ml-3 text-on-surface">
                  Recibir notificaciones por email
                </label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="sms-notif" class="rounded" />
                <label for="sms-notif" class="ml-3 text-on-surface">
                  Recibir notificaciones por SMS
                </label>
              </div>
              <div class="flex items-center">
                <input type="checkbox" id="payment-notif" checked class="rounded" />
                <label for="payment-notif" class="ml-3 text-on-surface">
                  Alertas de pagos
                </label>
              </div>
            </div>
          </div>
        </div>

        <!-- Sidebar Settings -->
        <div class="space-y-6">
          <!-- Support -->
          <div
            class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6"
          >
            <h3 class="text-lg font-bold text-primary mb-4">Soporte</h3>
            <button
              class="w-full px-4 py-2 border border-outline-variant/30 rounded-lg text-primary hover:bg-surface-container transition-all"
            >
              Contactar Soporte
            </button>
          </div>

          <!-- About -->
          <div
            class="bg-surface-container-lowest border border-outline-variant/20 rounded-xl p-6"
          >
            <h3 class="text-lg font-bold text-primary mb-4">Acerca de</h3>
            <p class="text-sm text-on-surface-variant">
              Dataverse Rentals v2.4.0
            </p>
          </div>
        </div>
      </div>

      <!-- Save Button -->
      <div class="mt-8 flex justify-end gap-4">
        <button
          class="px-6 py-3 border border-outline-variant/30 rounded-lg text-on-surface hover:bg-surface-container transition-all"
        >
          Cancelar
        </button>
        <button
          class="px-6 py-3 bg-primary-container text-white rounded-lg font-bold hover:opacity-95 transition-all"
        >
          Guardar Cambios
        </button>
      </div>
    </div>
  </DashboardLayout>
</template>

<script setup>
import DashboardLayout from '../components/DashboardLayout.vue';
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
