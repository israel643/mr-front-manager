<script setup>
import { IconSquareRoundedPlus } from '@tabler/icons-vue';

const props = defineProps(['title','modelValue']);
const emit = defineEmits(['update:modelValue', 'create']);
</script>

<template>
    <div class="md:flex justify-between items-center mb-3">
        <div class="w-full flex items-center">
            <h2 class="text-2xl font-semibold">{{ title }}</h2>
            <button @click="$emit('create')" title="Agregar" class="mx-3 btn btn-soft btn-square btn-sm btn-primary">
                <IconSquareRoundedPlus class="w-6 h-6" />
            </button>
        </div>
        <label class="w-full md:w-8/12 input mt-3 md:m-0">
            <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none" stroke="currentColor">
                    <circle cx="11" cy="11" r="8"></circle>
                    <path d="m21 21-4.3-4.3"></path>
                </g>
            </svg>
            <input type="search" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
                placeholder="Buscar..." />
        </label>
    </div>
</template>