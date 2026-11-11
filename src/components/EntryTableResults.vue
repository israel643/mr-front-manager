<script setup>
import { storeToRefs } from 'pinia';
import { IconRulerMeasure2, IconBrandMedium, IconCategory2 } from '@tabler/icons-vue'
import { useEntryStore } from '@/stores/entryStore';
import { CartEntryItem } from '@/models/CartEntryItem'
import { API_BASE_URL } from '@/config';

import imageNotAvailable from '@/assets/images/image-not-found.png'

const props = defineProps(['isLoading']);
const emit = defineEmits(['add']);
const store = useEntryStore();
const { articles, cart } = storeToRefs(store);

const addToCart = (article) => {
    const item = cart.value.find((a) => a.articleId === article.id);
    if (item) {
        item.quantity++;
        item.subtotal = item.quantity * item.price;
    } else {
        cart.value.push(new CartEntryItem({ ...article, quantity: 1 }));
    }
};
</script>

<template>
    <div class="w-full">
        <div class="overflow-x-auto w-full">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th></th>
                        <th>Datos</th>
                        <th>Costo</th>
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
                            <div class="min-w-[10rem] max-w-[15rem]">
                                <div class="font-bold truncate">{{ article.name }}</div>
                                <div class="text-md whitespace-normal opacity-80">{{ article.description }}</div>
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
                            <div>
                                <span class="text-nowrap opacity-80 font-semibold">$ {{ article.purchasePrice }}</span>
                            </div>
                        </td>
                        <td>
                            <button type="button" class="btn btn-soft btn-secondary"
                                @click="addToCart(article)">Agregar</button>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="n in 5" :key="n">
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
                            <div class="skeleton h-9 w-20 rounded"></div>
                        </td>
                    </tr>
                </tbody>
            </table>
        </div>
    </div>
</template>