<script setup>
import { ref } from 'vue';
import { useUserStore } from '@/stores/userStore';
import { useToast } from 'vue-toastification';
import Loading from 'vue-loading-overlay';
import UserTable from '@/components/UserTable.vue';
import UserForm from '@/components/UserForm.vue';
import UserPasswordForm from '@/components/UserPasswordForm.vue';
import BaseModalConfirm from '@/components/BaseModalConfirm.vue';

const toast = useToast();
const store = useUserStore();
const isLoading = ref(false);
const showFormModal = ref(false);
const userToSave = ref(null);
const userToToggle = ref(null);
const userToPassword = ref(null);

const openForm = (user) => {
    userToSave.value = user;
    showFormModal.value = true;
};

const openPassword = (user) => {
    userToPassword.value = user;
};

const openConfirm = (user) => {
    userToToggle.value = user;
};

const closeForm = () => {
    showFormModal.value = false;
    userToSave.value = null;
};

const closePassword = () => {
    userToPassword.value = null;
};

const closeConfirm = () => {
    userToToggle.value = null;
};

const saveUser = async ({ formData }) => {
    isLoading.value = true;
    try {
        const message = await store.saveOrUpdateUser(formData);
        toast.success(message);
        closeForm();
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
};

const changeUserPassword = async (password) => {
    isLoading.value = true;
    try {
        const message = await store.changeUserPassword(userToPassword.value.id, password);
        toast.success(message);
        userToPassword.value = null;
    } catch (e) {
        toast.error(e.message);
    } finally {
        isLoading.value = false;
    }
}

const toggleUserStatus = async () => {
    isLoading.value = true;
    try {
        const message = await store.changeUserStatus(userToToggle.value.id, !userToToggle.value.active);
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
        class="flex justify-center w-full md:w-12/12 lg:w-10/12 xl:w-7/12 p-6 bg-base-100 rounded-xl shadow-lg mx-auto">
        <UserTable @open-form="openForm" @password="openPassword" @toggle="openConfirm" />
    </div>

    <UserForm :open="showFormModal" :initial-user="userToSave" :is-editing="userToSave?.id != null" @save="saveUser"
        @close="closeForm" />

    <UserPasswordForm :open="userToPassword?.id != null" :user-name="userToPassword?.fullName"
        @save="changeUserPassword" @close="closePassword" />

    <BaseModalConfirm :open="userToToggle?.id != null"
        :title="userToToggle?.active ? 'Desactivar usuario' : 'Activar usuario'"
        :message="`¿Está seguro de que desea ${userToToggle?.active ? 'desactivar' : 'activar'} a ${userToToggle?.fullName}?`"
        :confirm-text="userToToggle?.active ? 'Desactivar' : 'Activar'" :cancel-text="'Cancelar'"
        @confirm="toggleUserStatus" @cancel="closeConfirm" />
</template>