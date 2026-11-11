<script setup>
import { IconCaretLeftFilled, IconCaretRightFilled } from '@tabler/icons-vue';
defineProps(['page', 'totalPages', 'rowsPerPage']);
const emit = defineEmits(['increasePage', 'decreasePage', 'update:rowsPerPage']);

function handleChange(event) {
    emit('update:rowsPerPage', parseInt(event.target.value));
}
</script>

<template>
    <div class="w-full flex justify-center md:justify-end items-center overflow-x-auto mt-4 gap-3">
        <div class="join">
            <button class="join-item btn btn-sm md:btn-md" :disabled="page === 1" @click="$emit('decreasePage')">
                <IconCaretLeftFilled />
            </button>
            <button class="join-item btn btn-sm md:btn-md hidden md:block">Página {{ page }} / {{ totalPages }}</button>
            <button class="join-item btn btn-sm md:btn-md md:hidden">{{ page }} / {{ totalPages }}</button>
            <button class="join-item btn btn-sm md:btn-md" :disabled="page === totalPages"
                @click="$emit('increasePage')">
                <IconCaretRightFilled />
            </button>
        </div>
        <div class="flex overflow-x-auto">
            <label class="flex items-center font-medium ml-6 mr-1">
                <span class="label-text font-semibold whitespace-nowrap hidden md:block">Registros por página</span>
                <span class="label-text font-semibold md:hidden">Registros</span>
            </label>
            <select :value="rowsPerPage" class="select font-semibold bg-base-200 border-0 select-sm md:select-md" @change="handleChange">
                <option value="2">2</option>
                <option value="5">5</option>
                <option value="10">10</option>
                <option value="20">20</option>
                <option value="50">50</option>
            </select>
        </div>
    </div>
</template>