<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { IconListDetails, IconPackageImport, IconPackageExport } from '@tabler/icons-vue'
import { useToast } from 'vue-toastification';

import { storeToRefs } from 'pinia';
import { useMovementStore } from '@/stores/movementStore';
import { formatDate } from '@/utils/dateUtils';

import BaseTableActionButton from '@/components/BaseTableActionButton.vue'
import MovementTableHeader from '@/components/MovementTableHeader.vue';
import ThePaginator from '@/components/ThePaginator.vue';

const emit = defineEmits(['detail']);
const title = 'Historial de movimientos';
const toast = useToast();
const store = useMovementStore();
const isLoading = ref(false);
const { movements, page, limit, totalItems } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));

const fetchMovements = async () => {
    isLoading.value = true;
    try {
        await store.loadMovements();
        await new Promise((resolve) => setTimeout(resolve, 900)); // Eliminar después
    } catch (error) {
        toast.error(error.message || 'Error al cargar los movimientos');
    } finally {
        isLoading.value = false;
    }
};

const increasePage = () => {
    if (page.value < totalPages.value) {
        store.page++;
    }
};

const decreasePage = () => {
    if (page.value > 1) {
        store.page--;
    }
};

watch(limit, () => {
    store.page = 1;
    fetchMovements();
});

watch(page, fetchMovements);

onMounted(fetchMovements);
</script>

<template>
    <div class="w-full">
        <MovementTableHeader :title="title" @filter-table="fetchMovements" />

        <div class="overflow-x-auto w-full">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th>Tipo Movimiento</th>
                        <th>Usuario</th>
                        <th>Total</th>
                        <th>Fecha</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="mov in movements" :key="mov.id">
                        <td>
                            <div class="badge badge-soft"
                                :class="mov.movementTypeId == 1 ? 'badge-primary' : 'badge-accent'">
                                <IconPackageImport v-if="mov.movementTypeId == 1" />
                                <IconPackageExport v-if="mov.movementTypeId != 1" />
                                <span>{{ mov.movementType.name }}</span>
                            </div>
                        </td>
                        <td class="text-nowrap">
                            {{ mov.user.name }} {{ mov.user.lastName }}
                        </td>
                        <td class="text-nowrap">
                            $ {{ mov.total }}
                        </td>
                        <td>
                            {{ formatDate(mov.createdAt) }}
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <BaseTableActionButton :icon="IconListDetails" tooltip="Detalles"
                                    @click="$emit('detail', mov)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="n in limit" :key="n">
                        <td>
                            <div class="skeleton h-4 w-14 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-35 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-14 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-40 rounded"></div>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <div class="skeleton h-8 w-8 rounded-lg"></div>
                            </div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ThePaginator :page="page" :total-pages="totalPages" @increasePage="increasePage" @decreasePage="decreasePage"
            v-model:rowsPerPage="limit" />
    </div>
</template>