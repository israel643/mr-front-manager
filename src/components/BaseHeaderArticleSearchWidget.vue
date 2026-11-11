<script setup>
import { storeToRefs } from 'pinia';
import { useOutputStore } from '@/stores/outputStore';

const props = defineProps(['title', 'modelValue']);
const emit = defineEmits(['find', 'update:modelValue']);

const store = useOutputStore();
const { matchOutput } = storeToRefs(store);
</script>

<template>
    <div class="mb-3">
        <div class="w-full flex items-center mb-3">
            <h2 class="text-2xl font-semibold">{{ title }}</h2>
        </div>
        <div class="w-full join">
            <label class="input join-item w-full">
                <svg class="h-[1em] opacity-50" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24">
                    <g stroke-linejoin="round" stroke-linecap="round" stroke-width="2.5" fill="none"
                        stroke="currentColor">
                        <circle cx="11" cy="11" r="8"></circle>
                        <path d="m21 21-4.3-4.3"></path>
                    </g>
                </svg>
                <input type="text" :value="modelValue" @input="$emit('update:modelValue', $event.target.value)" class="w-full"
                    placeholder="Ingresa nombre o descripción del producto" />
            </label>
            <button @click="$emit('find')" class="btn btn-ghost join-item">Buscar</button>
        </div>
    </div>
</template>