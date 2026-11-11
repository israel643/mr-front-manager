<script setup>
import { ref } from 'vue';
import { useMeasurementStore } from '@/stores/measurementStore';
import { useToast } from 'vue-toastification';
import Loading from 'vue-loading-overlay';
import MeasurementTable from '@/components/MeasurementTable.vue';
import MeasurementForm from '@/components/MeasurementForm.vue';
import ConfirmModal from '@/components/BaseModalConfirm.vue';

const toast = useToast();
const store = useMeasurementStore();
const isLoading = ref(false);
const showFormModal = ref(false);
const measurementToSave = ref(null);
const measurementToToggle = ref(null);

const openForm = (measurement) => {
    measurementToSave.value = measurement;
    showFormModal.value = true;
};

const closeForm = () => {
    showFormModal.value = false;
    measurementToSave.value = null;
};

const openConfirm = (measurement) => {
    measurementToToggle.value = measurement;
};

const closeConfirm = () => {
    measurementToToggle.value = null;
};

const saveMeasurement = async (data) => {
    isLoading.value = true;
    try {
        const message = await store.saveOrUpdateMeasurement(data);
        toast.success(message);
        closeForm();
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const toggleMeasurementStatus = async () => {
    isLoading.value = true;
    try {
        const message = await store.changeMeasurementStatus(measurementToToggle.value.id, !measurementToToggle.value.active);
        toast.success(message);
        closeConfirm();
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};
</script>

<template>
    <Loading :active="isLoading" :is-full-page="false" color="primary" />

    <div class="flex justify-center w-full md:w-10/12 xl:w-7/12 p-6 bg-base-100 rounded-xl shadow-lg mx-auto">
        <MeasurementTable @open-form="openForm" @toggle="openConfirm" />
    </div>

    <MeasurementForm :open="showFormModal" :initial-measurement="measurementToSave"
        :is-editing="measurementToSave?.id != null" @save="saveMeasurement" @close="closeForm" />

    <ConfirmModal :open="measurementToToggle?.id != null"
        :title="measurementToToggle?.active ? 'Desactivar medida' : 'Activar medida'"
        :message="`¿Está seguro de que desea ${measurementToToggle?.active ? 'desactivar' : 'activar'} la medida ${measurementToToggle?.name}( ${measurementToToggle?.abbreviation} )?`"
        :confirm-text="measurementToToggle?.active ? 'Desactivar' : 'Activar'" :cancel-text="'Cancelar'"
        @confirm="toggleMeasurementStatus" @cancel="closeConfirm" />
</template>