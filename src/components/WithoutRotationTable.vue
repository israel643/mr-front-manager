<script setup>
import { ref, computed, watch } from 'vue';
import { useWithoutRotationStore } from '@/stores/withoutRotationStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

import ThePaginator from '@/components/ThePaginator.vue';

const store = useWithoutRotationStore();
const { withoutRotationList, page, limit, totalItems } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
const isLoading = ref(false);
const toast = useToast();

const fetchWithoutRotationData = async () => {
    isLoading.value = true;
    try {
        await store.loadWithoutRotationData();
    } catch (error) {
        toast.error(error.message || 'Error al obtener la informacion de articulos sin rotacion');
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
    fetchWithoutRotationData();
});

watch(page, fetchWithoutRotationData);
</script>

<template>
    <div class="bg-base-100 p-4 rounded shadow">
        <h3 class="text-xl font-bold mb-4">Productos sin Rotación</h3>
        <div class="overflow-x-auto">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th>Producto</th>
                        <th>Stock</th>
                        <th>Última Venta</th>
                    </tr>
                </thead>
                <tbody>
                    <tr v-for="item in withoutRotationList" :key="item.id" class="hover">
                        <td>
                            <div>
                                <span class="font-semibold">{{ item.name }}</span>
                                <br/>
                                <span>{{ item.description }}</span>
                            </div>
                        </td>
                        <td>{{ item.stock }}</td>
                        <td>
                            <span class="text-error font-bold text-center text-lg" v-if="item.lastSale">{{ item.lastSale }}</span>
                            <span class="text-error font-bold text-center text-md" v-else>Sin ventas</span>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
        <ThePaginator :page="page" :total-pages="totalPages" @increasePage="increasePage" @decreasePage="decreasePage"
            v-model:rowsPerPage="limit" />
    </div>
</template>
