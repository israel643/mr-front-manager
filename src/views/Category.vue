<script setup>
import { ref } from 'vue';
import { useCategoryStore } from '@/stores/categoryStore';
import { useToast } from 'vue-toastification';
import Loading from 'vue-loading-overlay';
import CategoryTable from '@/components/CategoryTable.vue';
import CategoryForm from '@/components/CategoryForm.vue';
import BaseModalConfirm from '@/components/BaseModalConfirm.vue';

const toast = useToast();
const store = useCategoryStore();
const isLoading = ref(false);
const showFormModal = ref(false);
const showConfirmModal = ref(false);
const categoryToSave = ref(null);
const categoryToToggle = ref(null);

const openForm = (category) => {
    categoryToSave.value = category;
    showFormModal.value = true;
};

const openConfirm = (category) => {
    categoryToToggle.value = category;
    showConfirmModal.value = true;
};

const closeForm = () => {
    showFormModal.value = false;
    categoryToSave.value = null;
};

const closeConfirm = () => {
    showConfirmModal.value = false;
    categoryToToggle.value = null;
};

const saveCategory = async (data) => {
    isLoading.value = true;
    try {
        const message = await store.saveOrUpdateCategory(data);
        toast.success(message);
        closeForm();
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const toggleCategoryStatus = async () => {
    isLoading.value = true;
    try {
        const message = await store.changeCategoryStatus(categoryToToggle.value.id, !categoryToToggle.value.active);
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

    <div
        class="flex justify-center w-full md:w-12/12 lg:w-11/12 xl:w-7/12 p-6 bg-base-100 rounded-xl shadow-lg mx-auto">
        <CategoryTable @open-form="openForm" @toggle="openConfirm" />
    </div>

    <CategoryForm :open="showFormModal" :initial-category="categoryToSave" :is-editing="categoryToSave?.id != null"
        @save="saveCategory" @close="closeForm" />

    <BaseModalConfirm :open="showConfirmModal"
        :title="categoryToToggle?.active ? 'Desactivar categoria' : 'Activar categoria'"
        :message="`¿Está seguro de que desea ${categoryToToggle?.active ? 'desactivar' : 'activar'} la categoria ${categoryToToggle?.name}?`"
        :confirm-text="categoryToToggle?.active ? 'Desactivar' : 'Activar'" :cancel-text="'Cancelar'"
        @confirm="toggleCategoryStatus" @cancel="closeConfirm" />
</template>