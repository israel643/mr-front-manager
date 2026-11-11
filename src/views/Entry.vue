<script setup>
import { ref } from 'vue';
import { storeToRefs } from 'pinia';
import { useEntryStore } from '@/stores/entryStore'; 
import { useToast } from 'vue-toastification';
import Loading from 'vue-loading-overlay';
import BaseHeaderArticleSearchWidget from '@/components/BaseHeaderArticleSearchWidget.vue';
import EntryTableResults from '@/components/EntryTableResults.vue';
import EntryTableCart from '@/components/EntryTableCart.vue';
import ConfirmModal from '@/components/BaseModalConfirm.vue';

const title = "Registro de entradas"
const isLoading = ref(false);
const isLoadData = ref(false);
const store = useEntryStore();
const toast = useToast();
const showModal = ref(false);
const { matchEntry } = storeToRefs(store);

const findArticles = async () => {
    if (!matchEntry.value) {
        toast.error('Necesitas escribir un criterio de busqueda');
        return;
    }

    isLoadData.value = true;
    try {
        await store.findArticles();
        await new Promise((resolve) => setTimeout(resolve, 900)); // Eliminar después
    } catch (error) {
        toast.error(error.message || 'Error al cargar los articulos');
    } finally {
        isLoadData.value = false;
    }
};

const createEntry = async () => {
    isLoading.value = true;
    try {
        await store.createEntry();
        await new Promise((resolve) => setTimeout(resolve, 900)); // Eliminar después
        toast.success("Entrada de articulos creada exitosamente");
        showModal.value = false;
    } catch (error) {
        toast.error(error.message || 'Error al crear la entrada de articulos');
    } finally {
        isLoading.value = false;
    }
}
</script>

<template>
    <Loading :active="isLoading" :is-full-page="true" color="primary" />
    <div class="xl:flex justify-center w-full md:w-12/12 p-4 bg-base-100 rounded-xl shadow-lg mx-auto">
        <div class="w-full xl:w-7/12 mb-3 xl:mb-0 px-4">
            <BaseHeaderArticleSearchWidget :title="title" v-model="matchEntry" @find="findArticles" />
            <EntryTableResults :is-loading="isLoadData" />
        </div>
        <div class="w-full xl:w-5/12 flex flex-col px-4 bg-base-300">
            <EntryTableCart @open-confirm="showModal = true" />
        </div>
    </div>
    <ConfirmModal title="Confirmar salida" message="¿Seguro que quieres confirmar la salida de productos?"
        confirm-text="Aceptar" cancel-text="Cancelar" :open="showModal" @confirm="createEntry" @cancel="showModal = false" />
</template>