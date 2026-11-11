<script setup>
import { onMounted } from 'vue';
import { RouterView } from 'vue-router';
import { useThemeStore } from '@/stores/themeStore';
import api from './services/api';

const themeStore = useThemeStore();

onMounted(async () => {
    try {
        await api.get('/auth/profile');
        themeStore.initTheme();
    } catch (error) {
    }
})
</script>

<template>
    <RouterView />
</template>