<script setup>
import { ref } from 'vue';
import { useAuthStore } from '@/stores/authStore';
import { useToast } from 'vue-toastification';
import { IconEye, IconEyeOff } from '@tabler/icons-vue'

const email = ref('');
const password = ref('');
const showPassword = ref(false);
const authStore = useAuthStore();
const loading = ref(false);
const toast = useToast();

const handleLogin = async () => {
  loading.value = true
  try {
    await authStore.login(email.value, password.value);
    toast.success("Bienvenido")
  } catch (err) {
    toast.error(err.response.data.error);
  } finally {
    loading.value = false;
  }
};
</script>

<template>
  <div class="card bg-base-100 shadow-xl px-6 md:px-10 py-8 w-full mx-3 md:w-1/3">
    <h2 class="text-2xl font-bold text-center mb-6 text-base-content">Iniciar sesión</h2>
    <form @submit.prevent="handleLogin" class="flex flex-col items-center space-y-4">
      <div class="w-full">
        <label class="block text-sm font-medium text-base-content mb-1">Correo electrónico</label>
        <input v-model="email" type="email" placeholder="correo@usuario.com" class="input w-full" required />
      </div>

      <div class="w-full">
        <label class="block text-sm font-medium text-base-content mb-1">Contraseña</label>
        <div class="relative">
          <input :type="showPassword ? 'text' : 'password'" v-model="password" placeholder="•••••••••••"
            class="input input-bordered w-full pr-10" required />
          <button type="button" class="absolute z-10 right-0 btn btn-square btn-soft btn-ghost"
            @click="showPassword = !showPassword" tabindex="-1">
            <IconEye class="w-[1.5rem] h-[1.5rem]" :class="!showPassword ? 'block' : 'hidden'" />
            <IconEyeOff class="w-[1.5rem] h-[1.5rem]" :class="showPassword ? 'block' : 'hidden'" />
          </button>
        </div>
      </div>

      <button type="submit" class="mt-4 btn btn-primary w-full" :disabled="loading">
        <span v-if="loading" class="loading loading-spinner"></span>
        <span v-else class="font-semibold text-lg uppercase">Ingresar</span>
      </button>
    </form>
  </div>
</template>