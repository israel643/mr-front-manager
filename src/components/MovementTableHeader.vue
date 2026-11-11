<script setup>
import { storeToRefs } from 'pinia';
import { useMovementStore } from '@/stores/movementStore';

const props = defineProps(['title']);
const emit = defineEmits(['filterTable']);
const store = useMovementStore();
const { movementTypeId, startDate, endDate } = storeToRefs(store);
</script>

<template>
    <div class="w-full mb-3">
        <h2 class="text-2xl font-semibold">{{ title }}</h2>
    </div>

    <div class="w-full mb-3">
        <!-- Filtros -->
        <div class="flex flex-wrap gap-x-6 gap-y-2 items-start">
            <div>
                <label class="block text-md font-medium mb-1">
                    <span class="label-text font-semibold">Tipo de Movimiento</span>
                </label>
                <select v-model="movementTypeId" @change="$emit('filterTable')" class="select select-bordered w-full">
                    <option :value="null" selected>Todos</option>
                    <option value="1">Entrada</option>
                    <option value="2">Salida</option>
                </select>
            </div>

            <div>
                <label class="block text-md font-medium mb-1">
                    <span class="label-text font-semibold">Desde</span>
                </label>
                <input type="date" v-model="startDate" @change="$emit('filterTable')" onkeydown="return false"
                    class="input input-bordered w-full" />
            </div>

            <div>
                <label class="block text-md font-medium mb-1">
                    <span class="label-text font-semibold">Hasta</span>
                </label>
                <input type="date" v-model="endDate" @change="$emit('filterTable')" onkeydown="return false"
                    class="input input-bordered w-full" />
            </div>
        </div>
    </div>
</template>