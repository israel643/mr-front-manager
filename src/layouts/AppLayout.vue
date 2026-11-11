<script setup>
import { ref, onMounted, onBeforeUnmount } from 'vue';
import { RouterView } from 'vue-router';
import TopBar from '@/components/TopBar.vue';
import SideBar from '@/components/SideBar.vue';

const isMenuOpen = ref(true)
const isDesktop = ref(false)

const updateScreenSize = () => {
    isDesktop.value = window.innerWidth >= 1024
    if (isDesktop.value) {
        isMenuOpen.value = true
    } else {
        isMenuOpen.value = false
    }
}

const toggleSidebar = () => {
    isMenuOpen.value = !isMenuOpen.value
}

const closeSidebarIfMobile = () => {
    if (!isDesktop.value) isMenuOpen.value = false
}

onMounted(() => {
    updateScreenSize()
    window.addEventListener('resize', updateScreenSize)
    document.addEventListener('click', onClickOutside)
})

onBeforeUnmount(() => {
    window.removeEventListener('resize', updateScreenSize)
    document.removeEventListener('click', onClickOutside)
})

// Referencia para detectar clics fuera del sidebar
const sidebarRef = ref(null)

const onClickOutside = (event) => {
    if (!isDesktop.value && isMenuOpen.value) {
        console.log(sidebarRef.value)
        const sidebarEl = sidebarRef.value
        if (sidebarEl && !sidebarEl.contains(event.target)) {
            isMenuOpen.value = false
        }
    }
}
</script>

<template>
    <div class="h-screen w-screen overflow-hidden flex flex-col bg-base-300">
        <!-- TopBar -->
        <header class="fixed top-0 left-0 w-full h-[4rem] z-40 bg-base-100 shadow-md border-b-2 border-base-300">
            <TopBar :is-menu-open="isMenuOpen" @toggle-sidebar="toggleSidebar" />
        </header>

        <div class="w-full flex overflow-hidden pt-[4rem]">
            <!-- Sidebar -->
            <Transition name="slide">
                <SideBar v-show="isMenuOpen" @close-menu="closeSidebarIfMobile" />
            </Transition>

            <!-- Overlay para mobile -->
            <div v-if="isMenuOpen && !isDesktop" class="fixed inset-0 z-10 bg-black bg-opacity-50"
                @click="closeSidebarIfMobile"></div>

            <!-- Main Content -->
            <main class="flex-1 overflow-auto p-3 transition-all duration-500"
                :class="{ 'lg:ml-[17rem]': isMenuOpen && isDesktop }">
                <div class="w-full max-w-[calc(100vw-2rem)] mx-auto">
                    <RouterView />
                </div>
            </main>
        </div>
    </div>
</template>

<style scoped>
.slide-enter-active,
.slide-leave-active {
    transition: transform 0.3s ease;
}

.slide-enter-from,
.slide-leave-to {
    transform: translateX(-100%);
}
</style>
