<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { IconEdit, IconPower } from '@tabler/icons-vue';
import { useToast } from 'vue-toastification';

import { storeToRefs } from 'pinia';
import { useCategoryStore } from '@/stores/categoryStore';
import { Category } from '@/models/Category';

import BaseTableActionButton from '@/components/BaseTableActionButton.vue';
import BaseTableHeader from '@/components/BaseTableHeader.vue';
import ThePaginator from '@/components/ThePaginator.vue';

const emit = defineEmits(['openForm', 'toggle']);
const title = 'Gestión de categorias';
const toast = useToast();
const store = useCategoryStore();
const isLoading = ref(false);
const { categories, page, limit, totalItems, matchCategory } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
let debouncedTimeout = null;

const fetchCategories = async () => {
    isLoading.value = true;
    try {
        await store.loadCategories();
    } catch (error) {
        toast.error(error.message || 'Error al cargar las categorías');
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
    fetchCategories();
});

watch(page, fetchCategories);

watch(matchCategory, (newValue) => {
    clearTimeout(debouncedTimeout);
    debouncedTimeout = setTimeout(() => {
        store.matchCategory = newValue;
        store.page = 1;
        fetchCategories();
    }, 700);
});

onMounted(fetchCategories);
</script>

<template>
    <div class="w-full">
        <BaseTableHeader :title="title" v-model="matchCategory" @create="$emit('openForm', new Category())" />
        <div class="overflow-x-auto w-full">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th>Nombre</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="category in categories" :key="category.id">
                        <td>{{ category.name }}</td>
                        <td>
                            <span :class="['badge', category.active ? 'badge-success' : 'badge-default']">
                                {{ category.active ? 'Activo' : 'Inactivo' }}
                            </span>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <BaseTableActionButton :icon="IconEdit" tooltip="Editar"
                                    @click="emit('openForm', category)" />
                                <BaseTableActionButton :icon="IconPower"
                                    :tooltip="category.active ? 'Desactivar' : 'Activar'"
                                    @click="emit('toggle', category)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="n in limit" :key="n">
                        <td>
                            <div class="skeleton h-4 w-48 rounded"></div>
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