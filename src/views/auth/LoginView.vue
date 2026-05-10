<template>
  <div class="flex flex-col min-h-screen bg-surface">
    <main class="flex-grow flex items-center justify-center px-4 md:px-0">
      <div class="w-full max-w-[420px] bg-white md:border md:border-gray-200 md:rounded-xl shadow-lg p-8 md:p-10">
        <div class="flex flex-col items-center mb-8">
          <div class="w-12 h-12 bg-primary rounded-lg flex items-center justify-center mb-4">
            <i class="pi pi-building text-white text-2xl"></i>
          </div>
          <h2 class="text-xl font-bold tracking-tight text-primary">Dataverse Rentals</h2>
        </div>

        <div class="mb-6">
          <h1 class="text-2xl font-bold text-gray-900">
            {{ step === 1 ? 'Iniciar sesión' : 'Verificación en dos pasos' }}
          </h1>
          <p v-if="step === 2" class="text-sm text-gray-600 mt-2">
            Ingresa el código enviado a tu aplicación de autenticación o correo electrónico.
          </p>
        </div>

        <form v-if="step === 1" @submit.prevent="handleLogin" class="space-y-6">
          <!-- Campo Usuario -->
          <div class="flex flex-col gap-2">
            <label for="email" class="text-sm font-medium text-gray-700">Correo electrónico o usuario</label>
            <InputText id="email" v-model="form.email" class="w-full" placeholder="usuario@empresa.com" />
          </div>

          <!-- Campo Contraseña -->
          <div class="flex flex-col gap-2 relative">
            <label for="password" class="text-sm font-medium text-gray-700">Contraseña</label>
            <Password id="password" v-model="form.password" :feedback="false" toggleMask class="w-full"
              inputClass="w-full" />
          </div>

          <Button type="submit" label="Ingresar" class="w-full" :loading="loading" />
        </form>

        <form v-else-if="step === 2" @submit.prevent="handleMfa" class="space-y-6">
          <div class="flex flex-col gap-2">
            <label for="mfaCode" class="text-sm font-medium text-gray-700">Código de verificación</label>
            <InputText id="mfaCode" v-model="form.mfaCode" class="w-full" placeholder="Ej. 123456" autocomplete="off" />
          </div>
          <Button type="submit" label="Verificar y Entrar" class="w-full" :loading="loading" />
          <Button type="button" label="Volver" class="w-full mt-2" severity="secondary" text @click="goBack" />
        </form>

        <div class="mt-6">
          <Message v-if="error" severity="error" :closable="false" class="w-full">{{ error }}</Message>
        </div>
      </div>
    </main>
  </div>
</template>

<script setup>
import { ref } from 'vue';
import { useRouter } from 'vue-router';
import { useStore } from '../../store/useStore';
import InputText from 'primevue/inputtext';
import Password from 'primevue/password';
import Button from 'primevue/button';
import Message from 'primevue/message';

const router = useRouter();
const store = useStore();

const loading = ref(false);
const error = ref('');
const step = ref(1);

const form = ref({
  email: 'admin@dataverserentals.com',
  password: '123456',
  mfaCode: '',
});

const handleLogin = async () => {
  loading.value = true;
  error.value = '';

  // Pequeño timeout para simular la petición
  setTimeout(() => {
    const success = store.login(form.value.email, form.value.password);
    if (success) {
      step.value = 2;
    } else {
      error.value = 'Credenciales inválidas. Intenta: admin@dataverserentals.com o juan.perez@email.com';
    }
    loading.value = false;
  }, 800);
};

const handleMfa = async () => {
  loading.value = true;
  error.value = '';

  setTimeout(() => {
    const success = store.verifyMfa(form.value.mfaCode);
    if (success) {
      if (store.isAdmin.value) {
        router.push('/admin/dashboard');
      } else if (store.isTenant.value) {
        router.push('/tenant/dashboard');
      }
    } else {
      error.value = 'Código de verificación incorrecto. Ingresa cualquier código de 4+ dígitos.';
    }
    loading.value = false;
  }, 800);
};

const goBack = () => {
  step.value = 1;
  store.logout();
  error.value = '';
};
</script>

<style scoped></style>
