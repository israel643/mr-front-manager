<script setup>
import { ref } from 'vue';
import { useArticleStore } from '@/stores/articleStore';
import { useToast } from 'vue-toastification';
import Loading from 'vue-loading-overlay';
import ArticleTable from '@/components/ArticleTable.vue';
import ArticleForm from '@/components/ArticleForm.vue';
import BaseModalConfirm from '@/components/BaseModalConfirm.vue';

const toast = useToast();
const store = useArticleStore();
const isLoading = ref(false);
const showFormModal = ref(false);
const articleToSave = ref(null);
const articleToToggle = ref(null);

const openForm = (article) => {
    articleToSave.value = article;
    showFormModal.value = true;
};

const closeForm = () => {
    showFormModal.value = false;
    articleToSave.value = null;
};

const openConfirm = (article) => {
    articleToToggle.value = article;
};

const closeConfirm = () => {
    articleToToggle.value = null;
};

const saveArticle = async ({ formData }) => {
    isLoading.value = true;
    try {
        const message = await store.saveOrUpdateArticle(formData);
        toast.success(message);
        closeForm();
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const toggleArticleStatus = async () => {
    isLoading.value = true;
    try {
        const message = await store.changeArticleStatus(articleToToggle.value.id, !articleToToggle.value.active);
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
    <Loading :active="isLoading" :is-full-page="true" color="primary" />

    <div
        class="flex justify-center w-full md:w-12/12 lg:w-10/12 xl:w-10/12 p-6 bg-base-100 rounded-xl shadow-lg mx-auto">
        <ArticleTable @open-form="openForm" @toggle="openConfirm" />
    </div>

    <ArticleForm :open="showFormModal" :initial-article="articleToSave" :is-editing="articleToSave?.id != null"
        @save="saveArticle" @close="closeForm" />

    <BaseModalConfirm :open="articleToToggle?.id != null"
        :title="articleToToggle?.active ? 'Desactivar articulo' : 'Activar articulo'"
        :message="`¿Está seguro de que desea ${articleToToggle?.active ? 'desactivar' : 'activar'} el articulo ${articleToToggle?.name}?`"
        :confirm-text="articleToToggle?.active ? 'Desactivar' : 'Activar'" :cancel-text="'Cancelar'"
        @confirm="toggleArticleStatus" @cancel="closeConfirm" />
</template>