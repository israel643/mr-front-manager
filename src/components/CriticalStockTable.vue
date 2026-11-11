<script setup>
import { ref, computed, watch } from 'vue';
import { useCriticalStore } from '@/stores/criticalStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

import ThePaginator from '@/components/ThePaginator.vue';

const store = useCriticalStore();
const { criticalStockList, page, limit, totalItems } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
const isLoading = ref(false);
const toast = useToast();

const fetchCriticalStockData = async () => {
    isLoading.value = true;
    try {
        await store.loadCriticalStockData();
    } catch (error) {
        toast.error(error.message || 'Error al obtener la informacion del criticalStock');
    } finally {
        isLoading.value = false;
    }
}

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
    fetchCriticalStockData();
});

watch(page, fetchCriticalStockData);
</script>

<template>
    <div class="bg-base-100 p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-4">Productos con Stock Crítico ( menor a 10 )</h3>
        <div class="overflow-x-auto">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th>Producto</th>
                        <th class="text-center">Stock Actual</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in criticalStockList" :key="item.id" class="hover">
                        <td>
                            <div>
                                <span class="font-semibold">{{ item.name }}</span>
                                <br>
                                <span>{{ item.description }}</span>
                            </div>
                        </td>
                        <td class="text-error font-bold text-center text-lg">{{ item.stock }}</td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ThePaginator :page="page" :total-pages="totalPages" @increasePage="increasePage" @decreasePage="decreasePage"
            v-model:rowsPerPage="limit" />
    </div>
</template>
