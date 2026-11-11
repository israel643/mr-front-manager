<script setup>
import { RouterView } from 'vue-router';
import logoApp from '@/assets/logos/manager-logo.png'
import TheThemeToggle from '@/components/TheThemeToggle.vue'
</script>

<template>
    <div class="h-screen w-screen flex flex-col items-center justify-start bg-base-300">
        <div class="w-full flex items-center justify-between h-[4rem] bg-base-100 px-4">
            <div>
                <img :src="logoApp" alt="MR Logo" class="object-contain px-2 max-w-[8rem]" />
            </div>
            <TheThemeToggle />
        </div>
        <div class="w-full min-h-[calc(100vh-4rem)] flex items-center justify-center">
            <RouterView />
        </div>
    </div>
</template>