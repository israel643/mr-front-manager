<script setup>
import { ref, watch, computed } from 'vue';
import useVuelidate from '@vuelidate/core';

import { emailProviderRules } from '@/validators/emailProviderRules';
import { getValidationError } from '@/composables/useValidationMessages';
import { IconTrash, IconClipboard } from "@tabler/icons-vue";
import { useEmailStore } from '@/stores/emailStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';

const props = defineProps(['open', 'selectedProvider']);
const emit = defineEmits(['save', 'close', 'delete']);

const store = useEmailStore();
const { emails } = storeToRefs(store);

const isLoading = ref(false);
const newEmail = ref('');
const toast = useToast();

const fetchEmails = async (providerId) => {
    if (!providerId) return;

    isLoading.value = true;
    try {
        await store.fetchEmails(providerId);
    } catch (err) {
        console.error('Error al obtener correos:', err);
    } finally {
        isLoading.value = false;
    }
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen && props.selectedProvider?.id) {
            fetchEmails(props.selectedProvider.id);
        }
    }
);

const rules = { newEmail: emailProviderRules.newEmail }
const state = { newEmail }
const $v = useVuelidate(rules, state);
const isFormValid = computed(() => !$v.value.newEmail.$invalid);

const emailError = computed(() =>
    getValidationError($v.value.newEmail, {
        email: 'Debe ser un correo electrónico válido'
    })
);

const copyToClipboard = (text) => {
    navigator.clipboard.writeText(text).then(() => {
        toast.info('Copiado al portapapeles', {
            position: 'top-right',
            timeout: 2500,
        });
    })
};

function closeForm() {
    $v.value.$reset();
    emit('close')
}

const addEmail = async () => {
    if (!newEmail.value) return;

    $v.value.$touch();
    if (!$v.value.$invalid) {
        emit('save', newEmail.value);
        newEmail.value = '';
        $v.value.$reset();
    }
};
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-11/12 md:max-w-8/12 lg:max-w-6/12 xl:max-w-5/12">
            <h2 class="text-2xl font-bold mb-4">Correos de {{ selectedProvider?.name }}</h2>
            <BaseCloseModalButton @close="closeForm" />

            <div class="flex w-full items-center gap-2 my-4">
                <input v-model="newEmail" type="email" placeholder="provedor@correo" @blur="$v.newEmail.$touch()"
                    class="w-full md:w-7/12 lg:w-8/12 xl:w-5/12 border p-2 rounded-lg mt-2" />
                <button @click="addEmail" :disabled="!isFormValid" class="btn btn-neutral">Agregar</button>
            </div>
            <p v-if="emailError" class="text-error text-sm mt-1">{{ emailError }}</p>

            <ul v-if="!isLoading" class="space-y-2">
                <li v-for="email in emails" :key="email.id" class="flex justify-between items-center p-2 rounded-lg">
                    <span>{{ email.email }}</span>
                    <div class="flex gap-2">
                        <button @click="copyToClipboard(email.email)"
                            class="btn btn-soft btn-square btn-sm btn-secondary">
                            <IconClipboard class="w-4 h-4" />
                        </button>
                        <button @click="$emit('delete', email.id)" class="btn btn-soft btn-square btn-sm btn-secondary">
                            <IconTrash class="w-4 h-4" />
                        </button>
                    </div>
                </li>
            </ul>
            <ul v-else class="space-y-2">
                <li v-for="i in 4" :key="i">
                    <div class="flex justify-between">
                        <div class="skeleton h-4 w-24 rounded"></div>
                        <div class="flex gap-2">
                            <div class="skeleton h-8 w-8 rounded-md"></div>
                            <div class="skeleton h-8 w-8 rounded-md"></div>
                        </div>
                    </div>
                </li>
            </ul>
        </div>
    </dialog>
</template>