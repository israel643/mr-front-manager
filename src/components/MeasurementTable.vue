<script setup>
import { ref, onMounted, watch, computed } from 'vue';
import { IconEdit, IconPower } from '@tabler/icons-vue';
import { useToast } from 'vue-toastification';

import { storeToRefs } from 'pinia';
import { useMeasurementStore } from '@/stores/measurementStore';
import { Measurement } from '@/models/Measurement';

import BaseTableActionButton from '@/components/BaseTableActionButton.vue';
import BaseTableHeader from '@/components/BaseTableHeader.vue';
import ThePaginator from '@/components/ThePaginator.vue';

const emit = defineEmits(['openForm', 'toggle']);
const title = 'Gestión de medidas';
const toast = useToast();
const store = useMeasurementStore();
const isLoading = ref(false);
const { measurements, page, limit, totalItems, matchMeasurement } = storeToRefs(store);
const totalPages = computed(() => Math.ceil(totalItems.value / limit.value));
let debouncedTimeout = null;

const fetchMeasurements = async () => {
    isLoading.value = true;
    try {
        await store.loadMeasurements();
    } catch (error) {
        toast.error(error.message || 'Error al cargar las medidas');
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
    fetchMeasurements();
});

watch(page, fetchMeasurements);

watch(matchMeasurement, (newValue) => {
    clearTimeout(debouncedTimeout);
    debouncedTimeout = setTimeout(() => {
        store.matchMeasurement = newValue;
        store.page = 1;
        fetchMeasurements();
    }, 700);
});

onMounted(fetchMeasurements);
</script>

<template>
    <div class="w-full">
        <BaseTableHeader :title="title" v-model="matchMeasurement" @create="$emit('openForm', new Measurement())" />
        <div class="overflow-x-auto w-full">
            <table class="table table-md table-zebra w-full">
                <thead>
                    <tr class="bg-base-200 text-base-content">
                        <th>Nombre</th>
                        <th>Abreviatura</th>
                        <th>Estatus</th>
                        <th>Acciones</th>
                    </tr>
                </thead>
                <tbody v-if="!isLoading">
                    <tr v-for="measurement in measurements" :key="measurement.id">
                        <td>{{ measurement.name }}</td>
                        <td>{{ measurement.abbreviation }}</td>
                        <td>
                            <span :class="['badge badge-md', measurement.active ? 'badge-success' : 'badge-default']">{{
                                measurement.active ? 'Activo' : 'Inactivo'
                            }}</span>
                        </td>
                        <td>
                            <div class="flex gap-2">
                                <BaseTableActionButton :icon="IconEdit" tooltip="Editar"
                                    @click="emit('openForm', measurement)" />
                                <BaseTableActionButton :icon="IconPower"
                                    :tooltip="measurement.active ? 'Desactivar' : 'Activar'"
                                    @click="emit('toggle', measurement)" />
                            </div>
                        </td>
                    </tr>
                </tbody>
                <tbody v-else>
                    <tr v-for="n in limit" :key="n">
                        <td>
                            <div class="skeleton h-4 w-24 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-15 rounded"></div>
                        </td>
                        <td>
                            <div class="skeleton h-4 w-12 rounded"></div>
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