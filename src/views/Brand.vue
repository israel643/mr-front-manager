<script setup>
import { ref } from 'vue';
import { useBrandStore } from '@/stores/brandStore';
import { useToast } from 'vue-toastification';
import Loading from 'vue-loading-overlay';
import BrandTable from '@/components/BrandTable.vue';
import BrandForm from '@/components/BrandForm.vue';
import BaseModalConfirm from '@/components/BaseModalConfirm.vue';

const toast = useToast();
const store = useBrandStore();
const isLoading = ref(false);
const showFormModal = ref(false);
const brandToSave = ref(null);
const brandToToggle = ref(null);

const openForm = (brand) => {
    brandToSave.value = brand;
    showFormModal.value = true;
};

const closeForm = () => {
    showFormModal.value = false;
    brandToSave.value = null;
};

const openConfirm = (brand) => {
    brandToToggle.value = brand;
};

const closeConfirm = () => {
    brandToToggle.value = null;
};

const saveBrand = async ({ formData }) => {
    isLoading.value = true;
    try {
        const message = await store.saveOrUpdateBrand(formData);
        toast.success(message);
        closeForm();
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const toggleBrandStatus = async () => {
    isLoading.value = true;
    try {
        const message = await store.changeBrandStatus(brandToToggle.value.id, !brandToToggle.value.active);
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

    <div class="flex justify-center w-full md:w-12/12 xl:w-9/12 p-6 bg-base-100 rounded-xl shadow-lg mx-auto">
        <BrandTable @open-form="openForm" @toggle="openConfirm" />
    </div>

    <BrandForm :open="showFormModal" :initial-brand="brandToSave" :is-editing="brandToSave?.id != null"
        @save="saveBrand" @close="closeForm" />

    <BaseModalConfirm :open="brandToToggle?.id != null"
        :title="brandToToggle?.active ? 'Desactivar marca' : 'Activar marca'"
        :message="`¿Está seguro de que desea ${brandToToggle?.active ? 'desactivar' : 'activar'} la marca ${brandToToggle?.name}?`"
        :confirm-text="brandToToggle?.active ? 'Desactivar' : 'Activar'" :cancel-text="'Cancelar'"
        @confirm="toggleBrandStatus" @cancel="closeConfirm" />
</template>