<script setup>
import { storeToRefs } from 'pinia';
import { useAuthStore } from '@/stores/authStore';
import { IconChevronRight, IconChevronLeft, IconLogout2, IconMenu4 } from '@tabler/icons-vue';
import { useToast } from 'vue-toastification';
import { API_BASE_URL } from '@/config';

import logoApp from '@/assets/logos/manager-logo.png'
import defaultPhotoUser from '@/assets/images/user-default.png'
import TheThemeToggle from '@/components/TheThemeToggle.vue';

const props = defineProps({
    isMenuOpen: Boolean,
})

const authStore = useAuthStore();
const { user } = storeToRefs(authStore);
const emit = defineEmits(['toggleSidebar']);
const toast = useToast();

const handleLogout = async () => {
    try {
        const message = await authStore.logout();
        toast.success(message);
    } catch (error) {
        toast.error(error.message || 'error al cerrar la sesión');
    }
}
</script>

<template>
    <div class="w-full h-full flex justify-between items-center">
        <!-- Logo + Toggle -->
        <div class="w-[17rem] h-full border-r-2 border-base-300 hidden md:flex justify-center items-center relative transition-all duration-500"
            :class="{ 'w-[4rem]': !isMenuOpen }">
            <img :src="logoApp" alt="MR Logo" class="object-contain px-2 max-w-[8rem]" />
            <button @click="emit('toggleSidebar')"
                class="absolute top-1/2 btn btn-circle btn-primary -right-5 transform -translate-y-1/2 transition-transform duration-500"
                :class="{ 'rotate-180': !isMenuOpen }">
                <IconChevronRight v-show="!isMenuOpen" :size="30" />
                <IconChevronLeft v-show="isMenuOpen" :size="30" />
            </button>
        </div>

        <!-- Acciones del Topbar -->
        <div class="w-full md:w-[calc(100vw-17rem)] flex items-center justify-between md:justify-end gap-4 px-4">
            <div class="md:hidden">
                <button @click="emit('toggleSidebar')" class="top-1/2 btn btn-square btn-soft btn-primary"
                    :class="{ 'rotate-180': !isMenuOpen }">
                    <IconMenu4 :size="30" />
                </button>
            </div>

            <div class="flex">
                <TheThemeToggle class="hidden md:flex mx-4" />

                <!-- User Avatar -->
                <div class="dropdown dropdown-end">
                    <div tabindex="0" role="button" class="avatar">
                        <div class="w-10 rounded-full">
                            <img :src="user.photoUrl ? `${API_BASE_URL}${user.photoUrl}` : defaultPhotoUser"
                                alt="User Avatar" />
                        </div>
                    </div>
                    <ul class="dropdown-content z-[1] menu p-2 shadow bg-base-100 rounded-box w-45">
                        <li class="md:hidden">
                            <TheThemeToggle />
                        </li>
                        <li>
                            <button @click="handleLogout" class="text-error flex items-center gap-2 w-full text-left">
                                <IconLogout2 :size="20" /> Cerrar sesión
                            </button>
                        </li>
                    </ul>
                </div>
            </div>
        </div>

    </div>
</template>

<style scoped>
.rotate-180 {
    transform: rotate(180deg);
}
</style>