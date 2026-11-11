<script setup>
import { ref, watch } from 'vue';
import { useMovementItem } from '@/stores/movementItemStore';
import { storeToRefs } from 'pinia';

import BaseCloseModalButton from './BaseCloseModalButton.vue';

const props = defineProps(['open', 'movement']);
const emit = defineEmits(['close']);
const store = useMovementItem();
const { items } = storeToRefs(store);
const isLoading = ref(false);

const fetchItems = async (movementId) => {
    if (!movementId) return;

    isLoading.value = true;
    try {
        await store.fetchMovementDetails(movementId);
    } catch (err) {
        console.error('Error al obtener el detalle del movimiento:', err);
    } finally {
        isLoading.value = false;
    }
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen && props.movement?.id) {
            fetchItems(props.movement.id);
        }
    }
);

</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-11/12 md:max-w-10/12 lg:max-w-8/12 xl:max-w-7/12">
            <h2 class="text-2xl font-bold mb-4">Detalle del movimiento #{{ movement?.id }}</h2>
            <BaseCloseModalButton @click="$emit('close')" />

            <div class="overflow-x-auto w-full">
                <table class="table table-md table-zebra w-full">
                    <thead>
                        <tr>
                            <th></th>
                            <th>Articulo</th>
                            <th>Cantidad</th>
                            <th>Precio Unitario</th>
                            <th>Subtotal</th>
                        </tr>
                    </thead>
                    <tbody v-if="!isLoading">
                        <tr v-for="item in items" :key="item.id">
                            <td>
                                <figure class="w-30 h-20 overflow-hidden rounded-md">
                                    <img :src="item.article.imageUrl" :alt="item.article.name"
                                        class="object-cover w-full h-full">
                                </figure>
                            </td>
                            <td>
                                <div class="min-w-[15rem] md:min-w-[10rem] max-w-[20rem]">
                                    <div class="font-bold truncate">{{ item.article.name }}</div>
                                    <div class="text-md whitespace-normal opacity-80">{{ item.article.description }}</div>
                                </div>
                            </td>
                            <td>
                                <div class="text-center">
                                    {{ item.quantity }}
                                </div>
                            </td>
                            <td>
                                <div class="text-center">
                                    $ {{ item.price }}
                                </div>
                            </td>
                            <td>
                                <div class="text-center">
                                    $ {{ item.subtotal }}
                                </div>
                            </td>
                        </tr>
                    </tbody>
                </table>
            </div>

        </div>
    </dialog>
</template>