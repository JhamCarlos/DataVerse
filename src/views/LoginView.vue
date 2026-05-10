<template>
  <div class="flex flex-col min-h-screen bg-surface">
    <!-- Login Content Canvas -->
    <main class="flex-grow flex items-center justify-center px-4 md:px-0">
      <div
        class="w-full max-w-[420px] bg-surface-container-lowest md:border md:border-outline-variant/50 md:rounded-xl shadow-[0_4px_30px_rgba(25,28,30,0.04)] p-8 md:p-10"
      >
        <!-- Branding Section -->
        <div class="flex flex-col items-center mb-10">
          <div
            class="w-12 h-12 bg-primary-container rounded-lg flex items-center justify-center mb-4"
          >
            <span class="material-symbols-outlined text-white text-[24px]">
              domain
            </span>
          </div>
          <h2 class="text-xl font-bold tracking-tight text-primary-container">
            Dataverse Rentals
          </h2>
        </div>

        <!-- Header Section -->
        <div class="mb-8">
          <h1 class="text-2xl font-bold text-primary tracking-tight">
            {{ step === 1 ? 'Iniciar sesión' : 'Verificación en dos pasos' }}
          </h1>
          <p v-if="step === 2" class="text-sm text-on-surface-variant mt-2">
            Ingresa el código enviado a tu aplicación de autenticación (Ej. 123456).
          </p>
        </div>

        <div v-if="errorMsg" class="mb-4 p-3 bg-red-100 text-red-700 text-sm rounded-lg">
          {{ errorMsg }}
        </div>

        <!-- Login Form Step 1 -->
        <form v-if="step === 1" @submit.prevent="handleLogin" class="space-y-6">
          <!-- Username/Email Field -->
          <div class="space-y-1.5">
            <label
              class="block text-[13px] font-medium text-on-surface-variant tracking-wide"
              for="email"
            >
              Correo electrónico o usuario
            </label>
            <div class="relative">
              <input
                v-model="form.email"
                class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3 px-4 text-[14px] text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none placeholder:text-slate-400"
                id="email"
                name="email"
                placeholder="usuario@empresa.com"
                type="text"
              />
            </div>
          </div>

          <!-- Password Field -->
          <div class="space-y-1.5 relative">
            <label
              class="block text-[13px] font-medium text-on-surface-variant tracking-wide"
              for="password"
            >
              Contraseña
            </label>
            <div class="relative">
              <input
                v-model="form.password"
                :type="showPassword ? 'text' : 'password'"
                class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3 px-4 pr-10 text-[14px] text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none"
                id="password"
                name="password"
              />
              <button
                @click="showPassword = !showPassword"
                class="absolute right-3 top-1/2 -translate-y-1/2 text-slate-400 hover:text-primary transition-colors"
                type="button"
              >
                <span class="material-symbols-outlined text-[20px]">
                  {{ showPassword ? 'visibility_off' : 'visibility' }}
                </span>
              </button>
            </div>
            <div class="flex justify-end mt-1">
              <router-link
                class="text-[13px] font-medium text-primary hover:underline underline-offset-4 transition-all"
                to="#"
              >
                ¿Olvidaste tu contraseña?
              </router-link>
            </div>
          </div>

          <!-- Submit Button -->
          <button
            class="w-full bg-primary-container text-white py-3.5 rounded-lg font-bold text-[15px] shadow-sm hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
            type="submit"
          >
            Ingresar
          </button>
        </form>

        <!-- MFA Form Step 2 -->
        <form v-else-if="step === 2" @submit.prevent="handleMfa" class="space-y-6">
          <div class="space-y-1.5">
            <label class="block text-[13px] font-medium text-on-surface-variant tracking-wide" for="mfaCode">
              Código de verificación
            </label>
            <div class="relative">
              <input
                v-model="form.mfaCode"
                class="w-full bg-surface-container-lowest border border-outline-variant/30 rounded-lg py-3 px-4 text-[14px] text-on-surface focus:ring-2 focus:ring-primary/10 focus:border-primary transition-all duration-200 outline-none placeholder:text-slate-400"
                id="mfaCode"
                name="mfaCode"
                placeholder="123456"
                type="text"
                autocomplete="off"
              />
            </div>
          </div>
          <button
            class="w-full bg-primary-container text-white py-3.5 rounded-lg font-bold text-[15px] shadow-sm hover:opacity-95 active:scale-[0.98] transition-all duration-200 flex items-center justify-center"
            type="submit"
          >
            Verificar y Entrar
          </button>
          <button
            class="w-full mt-2 text-primary text-[14px] font-medium hover:underline flex items-center justify-center"
            type="button"
            @click="step = 1; store.logout()"
          >
            Volver
          </button>
        </form>

        <!-- Divider -->
        <div class="relative my-8">
          <div aria-hidden="true" class="absolute inset-0 flex items-center">
            <div class="w-full border-t border-outline-variant/20"></div>
          </div>
          <div class="relative flex justify-center text-sm">
            <span class="px-2 bg-surface-container-lowest text-slate-400">o</span>
          </div>
        </div>

        <!-- Footer Link Section -->
        <div class="text-center">
          <p class="text-[13px] text-on-surface-variant font-medium">
            ¿Eres inquilino?
            <router-link
              class="text-primary hover:underline underline-offset-4"
              to="#"
            >
              Accede con tu código
            </router-link>
          </p>
        </div>
      </div>
    </main>

    <!-- Footer Segment -->
    <footer class="bg-surface py-8 mt-auto border-t border-outline-variant/20">
      <div
        class="flex flex-col md:flex-row justify-between items-center px-6 lg:px-12 max-w-7xl mx-auto gap-4"
      >
        <div
          class="text-[13px] font-medium tracking-wide uppercase text-slate-400"
        >
          © 2026 Dataverse Rentals.
        </div>
        <div class="flex gap-6 text-[13px] font-medium tracking-wide uppercase text-slate-400">
          <a
            class="hover:text-primary transition-colors underline-offset-4 hover:underline"
            href="#"
          >
            Política de Privacidad
          </a>
          <a
            class="hover:text-primary transition-colors underline-offset-4 hover:underline"
            href="#"
          >
            Terminos de Servicio
          </a>
          <a
            class="hover:text-primary transition-colors underline-offset-4 hover:underline"
            href="#"
          >
            Contactar con soporte
          </a>
        </div>
      </div>
    </footer>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../store/useStore';

const router = useRouter();
const store = useStore();

const showPassword = ref(false);
const step = ref(1);
const errorMsg = ref('');

const form = ref({
  email: '',
  password: '',
  mfaCode: '',
});

const handleLogin = () => {
  errorMsg.value = '';
  if (form.value.email && form.value.password) {
    const success = store.login(form.value.email, form.value.password);
    if (success) {
      step.value = 2;
    } else {
      errorMsg.value = 'Usuario o contraseña incorrectos';
    }
  }
};

const handleMfa = () => {
  errorMsg.value = '';
  if (form.value.mfaCode) {
    const success = store.verifyMfa(form.value.mfaCode);
    if (success) {
      if (store.isAdmin.value) router.push('/admin/dashboard');
      else if (store.isTenant.value) router.push('/tenant/dashboard');
      else router.push('/');
    } else {
      errorMsg.value = 'Código de verificación incorrecto';
    }
  }
};
</script>

<style scoped>
.material-symbols-outlined {
  font-variation-settings: 'FILL' 0, 'wght' 400, 'GRAD' 0, 'opsz' 24;
}
</style>
