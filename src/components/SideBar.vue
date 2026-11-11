<script setup>
import { useRoute } from "vue-router";
import { storeToRefs } from "pinia";
import { useAuthStore } from '@/stores/authStore'
import { shallowRef } from "vue";
import SideBarItem from "@/components/SideBarItem.vue";

// Importar manualmente los iconos que usarás
import { IconPick, IconCategory2, IconTruckDelivery, IconRulerMeasure2, IconDirections, IconBrandMedium, IconLayoutCollage, IconPackageImport, IconPackageExport, IconUsers, } from "@tabler/icons-vue";

// Mapear los iconos en un objeto para acceso dinámico
const icons = shallowRef({
    IconPick,
    IconCategory2,
    IconLayoutCollage,
    IconBrandMedium,
    IconRulerMeasure2,
    IconDirections,
    IconTruckDelivery,
    IconPackageImport,
    IconPackageExport,
    IconUsers,
});

const emit = defineEmits(['closeMenu']);
// Obtener los paths
const route = useRoute();
const authStore = useAuthStore();
const { permissions } = storeToRefs(authStore);
</script>

<template>
    <aside
        class="bg-base-100 border-r-2 border-base-300 w-[17rem] fixed top-[4rem] left-0 h-[calc(100vh-4rem)] shadow-sm z-20">
        <nav class="px-2 py-3">
            <ul>
                <SideBarItem v-for="item in permissions" :key="item.id" :icon="icons[item.icon]" :name="item.name"
                    :route="item.route" :currentPath="route.path" @click="$emit('closeMenu')" />
            </ul>
        </nav>
    </aside>
</template>
