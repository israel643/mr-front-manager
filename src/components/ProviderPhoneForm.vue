<script setup>
import { ref, watch, computed } from 'vue';
import useVuelidate from '@vuelidate/core';

import { phoneProviderRules } from '@/validators/phoneProviderRules';
import { getValidationError } from '@/composables/useValidationMessages';
import { IconTrash, IconClipboard } from "@tabler/icons-vue";
import { usePhoneStore } from '@/stores/phoneStore';
import { storeToRefs } from 'pinia';
import { useToast } from 'vue-toastification';

import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';

const props = defineProps(['open', 'selectedProvider']);
const emit = defineEmits(['save', 'close', 'delete']);

const store = usePhoneStore();
const { phones } = storeToRefs(store);

const isLoading = ref(false);
const newPhone = ref('');
const toast = useToast();

const fetchPhones = async (providerId) => {
    if (!providerId) return;

    isLoading.value = true;
    try {
        await store.fetchPhones(providerId);
    } catch (err) {
        console.error('Error al obtener teléfonos:', err);
    } finally {
        isLoading.value = false;
    }
};

watch(
    () => props.open,
    (isOpen) => {
        if (isOpen && props.selectedProvider?.id) {
            fetchPhones(props.selectedProvider.id);
        }
    }
);

const rules = { newPhone: phoneProviderRules.newPhone }
const state = { newPhone }
const $v = useVuelidate(rules, state);
const isFormValid = computed(() => !$v.value.newPhone.$invalid);

const phoneError = computed(() =>
    getValidationError($v.value.newPhone, {
        validPhone: 'Debe ser un número de teléfono válido'
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

const addPhone = async () => {
    if (!newPhone.value) return;

    $v.value.$touch();
    if (!$v.value.$invalid) {
        emit('save', newPhone.value);
        newPhone.value = '';
        $v.value.$reset();
    }
};
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-11/12 md:max-w-8/12 lg:max-w-6/12 xl:max-w-5/12">
            <h2 class="text-2xl font-bold mb-4">Teléfonos de {{ selectedProvider?.name }}</h2>
            <BaseCloseModalButton @close="closeForm" />

            <div class="flex w-full items-center gap-2 my-4">
                <input v-model="newPhone" type="tel" placeholder="000000000" @blur="$v.newPhone.$touch()"
                    class="w-full md:w-7/12 lg:w-8/12 xl:w-5/12 border p-2 rounded-lg mt-2" />
                <button @click="addPhone" :disabled="!isFormValid"
                    class="btn btn-neutral">Agregar</button>
            </div>
            <p v-if="phoneError" class="text-error text-sm mt-1">{{ phoneError }}</p>

            <ul v-if="!isLoading" class="space-y-2">
                <li v-for="phone in phones" :key="phone.id" class="flex justify-between items-center p-2 rounded-lg">
                    <span>{{ phone.phone }}</span>
                    <div class="flex gap-2">
                        <button @click="copyToClipboard(phone.phone)"
                            class="btn btn-soft btn-square btn-sm btn-secondary">
                            <IconClipboard class="w-4 h-4" />
                        </button>
                        <button @click="$emit('delete', phone.id)" class="btn btn-soft btn-square btn-sm btn-secondary">
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