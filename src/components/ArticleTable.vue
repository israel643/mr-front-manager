<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { IconEdit, IconPower, IconBox, IconRulerMeasure2, IconBrandMedium, IconCategory2 } from '@tabler/icons-vue'
import { useToast } from 'vue-toastification';
import { storeToRefs } from 'pinia';
import { useArticleStore } from '@/stores/articleStore';
import { Article } from '@/models/Article';
import { API_BASE_URL } from '@/config';

import imageNotAvailable from '@/assets/images/image-not-found.png';
import BaseTableActionButton from '@/components/BaseTableActionButton.vue'
import BaseTableHeader from '@/components/BaseTableHeader.vue';
import ThePaginator from '@/components/ThePaginator.vue';

const emit = defineEmits(['openForm', 'toggle']);
const title = 'Gestión de articulos';
const toast = useToast();
const store = useArticleStore();
const isLoading = ref(false);
const { articles, page, limit, totalItems, matchArticle } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
let debouncedTimeout = null;

const fetchArticles = async () => {
    isLoading.value = true;
    try {
        await store.loadArticles();
    } catch (error) {
        toast.error(error.message || 'Error al cargar los articulos');
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
    fetchArticles();
});

watch(page, fetchArticles);

watch(matchArticle, (newValue) => {
    clearTimeout(debouncedTimeout);
    debouncedTimeout = setTimeout(() => {
        store.matchArticle = newValue;
        store.page = 1;
        fetchArticles();
    }, 700);
});

onMounted(fetchArticles);
</script>

<template>
    <div class="w-full">
        <BaseTableHeader :title="title" v-model="matchArticle" @create="$emit('openForm', new Article())" />
        <div class="overflow-x-auto w-full">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th></th> <!-- Image, Nombre, Descripcion -->
                        <th>Datos</th> <!-- Categoria, Marca, Unidad -->
                        <th>Stock</th>
                        <th>Precio</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="article in articles" :key="article.id">
                        <td class="flex items-center gap-3">
                            <figure class="w-30 h-20 overflow-hidden rounded-md">
                                <img :src="article.imageUrl ? `${API_BASE_URL}${article.imageUrl}` : imageNotAvailable"
                                    :alt="article.name" class="object-cover w-full h-full">
                            </figure>
                            <div>
                                <div class="font-bold">{{ article.name }}</div>
                                <div class="text-md opacity-80">{{ article.description }}</div>
                            </div>
                        </td>
                        <td>
                            <div class="flex items-center">
                                <IconCategory2 class="w-5 h-5 opacity-80" />
                                <span class="text-md text-nowrap opacity-80">{{ article.category.name }}</span>
                            </div>
                            <div class="flex items-center">
                                <IconBrandMedium class="w-5 h-5 opacity-80" />
                                <span class="text-md text-nowrap opacity-80">{{ article.brand.name }}</span>
                            </div>
                            <div class="flex items-center">
                                <IconRulerMeasure2 class="w-5 h-5 opacity-80" />
                                <span class="font-bold">{{ article.measurement.abbreviation }}</span>
                            </div>
                        </td>
                        <td>
                            <div class="flex">
                                <IconBox class="w-6 h-6 opacity-80" />
                                <span class="opacity-80">{{ article.stock }}</span>
                            </div>
                        </td>
                        <td>
                            <div>
                                <span class="text-nowrap opacity-80">{{ `Precio $ ${article.salePrice}` }}</span>
                            </div>
                            <div>
                                <span class="text-nowrap opacity-80">{{ `Costo $ ${article.purchasePrice}` }}</span>
                            </div>
                        </td>
                        <td>
                            <span :class="['badge badge-md', article.active ? 'badge-success' : 'badge-default']">{{
                                article.active ? 'Activo' : 'Inactivo'
                            }}</span>
                        </td>
                        <td>
                            <div class="flex gap-1">
                                <BaseTableActionButton :icon="IconEdit" tooltip="Editar"
                                    @click="$emit('openForm', article)" />
                                <BaseTableActionButton :icon="IconPower"
                                    :tooltip="article.active ? 'Desactivar' : 'Activar'"
                                    @click="$emit('toggle', article)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="n in limit" :key="n">
                        <td>
                            <div class="flex items-center gap-3">
                                <div class="skeleton w-30 h-20 rounded"></div>
                                <div>
                                    <div class="skeleton h-4 w-30 rounded"></div>
                                    <div class="skeleton h-4 w-50 rounded"></div>

                                </div>
                            </div>
                        </td>
                        <td>
                            <div>
                                <div class="skeleton h-4 w-42 rounded"></div>
                                <div class="skeleton h-4 w-18 rounded"></div>
                                <div class="skeleton h-4 w-12 rounded"></div>
                            </div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-12 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-12 rounded"></div>
                            <div class="skeleton h-4 w-12 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-12 rounded"></div>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <div class="skeleton h-8 w-8 rounded-lg"></div>
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