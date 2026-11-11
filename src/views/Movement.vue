<script setup>
import { ref } from 'vue';
import MovementTable from '@/components/MovementTable.vue';
import MovementModalDetail from '@/components/MovementModalDetail.vue';

const movementSelected = ref(null);

const openDetailModal = (movement) => {
    movementSelected.value = movement;
};

const closeDetailModal = () => {
    movementSelected.value = null;
};
</script>

<template>
    <div
        class="flex justify-center w-full md:w-12/12 lg:w-10/12 xl:w-10/12 p-6 bg-base-100 rounded-xl shadow-lg mx-auto">
        <MovementTable @detail="openDetailModal" />
    </div>

    <MovementModalDetail :open="movementSelected?.id != null" :movement="movementSelected" @close="closeDetailModal" />
</template>