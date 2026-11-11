<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { IconEdit, IconPower } from '@tabler/icons-vue';
import { useToast } from 'vue-toastification';
import { storeToRefs } from 'pinia';
import { useBrandStore } from '@/stores/brandStore'
import { Brand } from '@/models/Brand';
import { API_BASE_URL } from '@/config';

import imageNotAvailable from '@/assets/images/image-not-found.png';
import BaseTableActionButton from '@/components/BaseTableActionButton.vue';
import BaseTableHeader from '@/components/BaseTableHeader.vue';
import ThePaginator from '@/components/ThePaginator.vue';

const emit = defineEmits(['openForm', 'toggle']);
const title = 'Gestión de marcas';
const toast = useToast();
const store = useBrandStore();
const isLoading = ref(false);
const { brands, page, limit, totalItems, matchBrand } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
let debouncedTimeout = null;

const fetchBrands = async () => {
    isLoading.value = true;
    try {
        await store.loadBrands();
    } catch (error) {
        toast.error(error.message || 'Error al cargar las marcas');
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
    fetchBrands();
});

watch(page, fetchBrands);

watch(matchBrand, (newValue) => {
    clearTimeout(debouncedTimeout);
    debouncedTimeout = setTimeout(() => {
        store.matchCategory = newValue;
        store.page = 1;
        fetchBrands();
    }, 700);
});

onMounted(fetchBrands);
</script>

<template>
    <div class="w-full">
        <BaseTableHeader :title="title" v-model="matchBrand" @create="$emit('openForm', new Brand())" />
        <div class="overflow-x-auto w-full">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th></th>
                        <th>Nombre</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="brand in brands" :key="brand.id">
                        <td>
                            <div class="flex justify-center items-center">
                                <figure class="w-40 h-15 overflow-hidden rounded-md">
                                    <img :src="brand.logoUrl ? `${API_BASE_URL}${brand.logoUrl}` : imageNotAvailable"
                                        :alt="brand.name" class="object-cover w-full h-full">
                                </figure>
                            </div>
                        </td>
                        <td class="text-nowrap">{{ brand.name }}</td>
                        <td>
                            <span :class="['badge', brand.active ? 'badge-success' : 'badge-default']">
                                {{ brand.active ? 'Activo' : 'Inactivo' }}
                            </span>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <BaseTableActionButton :icon="IconEdit" tooltip="Editar"
                                    @click="emit('openForm', brand)" />
                                <BaseTableActionButton :icon="IconPower"
                                    :tooltip="brand.active ? 'Desactivar' : 'Activar'" @click="emit('toggle', brand)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="n in limit" :key="n">
                        <td>
                            <div class="skeleton h-10 w-30 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-24 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-24 rounded"></div>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <div class="skeleton h-8 w-8 rounded-full"></div>
                                <div class="skeleton h-8 w-8 rounded-full"></div>
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