<script setup>
import { ref } from 'vue';
import { useProviderStore } from '@/stores/providerStore';
import { usePhoneStore } from '@/stores/phoneStore';
import { useEmailStore } from '@/stores/emailStore';
import { useToast } from 'vue-toastification';
import Loading from 'vue-loading-overlay';
import ProviderTable from '@/components/ProviderTable.vue';
import ProviderForm from '@/components/ProviderForm.vue';
import ProviderPhoneForm from '@/components/ProviderPhoneForm.vue';
import ProviderEmailForm from '@/components/ProviderEmailForm.vue';
import ConfirmModal from '@/components/BaseModalConfirm.vue';

const toast = useToast();
const store = useProviderStore();
const phoneStore = usePhoneStore();
const emailStore = useEmailStore();
const isLoading = ref(false);
const showFormModal = ref(false);
const providerToSave = ref(null);
const providerToToggle = ref(null);
const providerToPhone = ref(null);
const providerToEmail = ref(null);

const openForm = (provider) => {
    providerToSave.value = provider;
    showFormModal.value = true;
};

const closeForm = () => {
    showFormModal.value = false;
    providerToSave.value = null;
};

const openPhoneForm = (provider) => {
    providerToPhone.value = provider;
};

const closePhoneForm = () => {
    providerToPhone.value = null;
};

const openEmailForm = (provider) => {
    providerToEmail.value = provider;
};

const closeEmailForm = () => {
    providerToEmail.value = null;
};

const openConfirm = (provider) => {
    providerToToggle.value = provider;
};

const closeConfirm = () => {
    providerToToggle.value = null;
};

const saveProvider = async ({ formData }) => {
    isLoading.value = true;
    try {
        const message = await store.saveOrUpdateProvider(formData);
        toast.success(message);
        closeForm();
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const savePhone = async (data) => {
    isLoading.value = true;
    try {
        await phoneStore.savePhone(data, providerToPhone.value.id);
        await new Promise((resolve) => setTimeout(resolve, 900)); // Eliminar después
        toast.success('Teléfono guardado');
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const saveEmail = async (data) => {
    isLoading.value = true;
    try {
        await emailStore.saveEmail(data, providerToEmail.value.id);
        await new Promise((resolve) => setTimeout(resolve, 900)); // Eliminar después
        toast.success('Correo guardado');
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const deletePhone = async (id) => {
    isLoading.value = true;
    try {
        await phoneStore.deletePhone(id);
        await new Promise((resolve) => setTimeout(resolve, 900)); // Eliminar después
        toast.success('Teléfono eliminado');
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const deleteEmail = async (id) => {
    isLoading.value = true;
    try {
        await emailStore.deleteEmail(id);
        await new Promise((resolve) => setTimeout(resolve, 900)); // Eliminar después
        toast.success('Correo eliminado');
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const toggleProviderStatus = async () => {
    isLoading.value = true;
    try {
        const message = await store.changeProviderStatus(providerToToggle.value.id, !providerToToggle.value.active);
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
    <Loading :active="isLoading" :is-full-page="true" color="red" />

    <div class="flex justify-center w-full md:w-12/12 lg:10/12 xl:w-9/12 p-6 bg-base-100 rounded-xl shadow-lg mx-auto">
        <ProviderTable @open-form="openForm" @open-phones="openPhoneForm" @open-emails="openEmailForm" @toggle="openConfirm" />
    </div>

    <ProviderForm :open="showFormModal" :initial-provider="providerToSave" :is-editing="providerToSave?.id != null"
        @save="saveProvider" @close="closeForm" />

    <ProviderPhoneForm :open="providerToPhone?.id != null" :selected-provider="providerToPhone" @save="savePhone"
        @close="closePhoneForm" @delete="deletePhone" />

    <ProviderEmailForm :open="providerToEmail?.id != null" :selected-provider="providerToEmail" @save="saveEmail"
        @close="closeEmailForm" @delete="deleteEmail" />

    <ConfirmModal :open="providerToToggle?.id != null"
        :title="providerToToggle?.active ? 'Desactivar proveedor' : 'Activar proveedor'"
        :message="`¿Está seguro de que desea ${providerToToggle?.active ? 'desactivar' : 'activar'} al proveedor ${providerToToggle?.name}?`"
        :confirm-text="providerToToggle?.active ? 'Desactivar' : 'Activar'" :cancel-text="'Cancelar'"
        @confirm="toggleProviderStatus" @cancel="closeConfirm" />
</template>