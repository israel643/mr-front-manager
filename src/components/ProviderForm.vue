<script setup>
import { reactive, watch, computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';

import { Provider } from '@/models/Provider';
import { providerRules } from '@/validators/providerRules';
import { getValidationError } from '@/composables/useValidationMessages';

import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseTextarea from '@/components/BaseTextarea.vue';
import BaseFormContainerActions from '@/components/BaseFormContainerActions.vue';

const props = defineProps(['open', 'isEditing', 'initialProvider']);
const emit = defineEmits(['save', 'close']);

const baseProvider = new Provider();
const provider = reactive({ ...baseProvider });
const imageFile = ref(null);

watch(() => props.initialProvider, (newVal) => {
    Object.assign(provider, newVal || baseProvider)
}, { immediate: true });

const $v = useVuelidate(providerRules, provider);
const isFormValid = computed(() => !$v.value.$invalid);

const nameError = computed(() =>
    getValidationError($v.value.name, {
        required: 'Campo obligatorio'
    })
);

const addressError = computed(() =>
    getValidationError($v.value.address, {
        required: 'Campo obligatorio'
    })
);

const handleImage = (e) => {
  imageFile.value = e.target.files[0]
};

function closeForm() {
    $v.value.$reset();
    emit('close')
};

function saveData() {
    $v.value.$touch();
    if (!$v.value.$invalid) {
        const formData = new FormData();
        if (provider.id) formData.append('id', provider.id);
        formData.append('name', provider.name);
        formData.append('address', provider.address);
        formData.append('active', provider.active);
        if (imageFile.value) formData.append('image', imageFile.value);
        emit('save', { formData });
        $v.value.$reset();
    }
};
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-2xl">
            <h2 class="text-2xl font-bold mb-4">
                {{ `${isEditing ? 'Editar' : 'Agregar'} proveedor` }}
            </h2>
            <BaseCloseModalButton @close="closeForm" />

            <!-- Oculto (Id, Status) -->
            <input type="hidden" v-model="provider.id" />
            <input type="hidden" v-model="provider.active" />

            <!-- Nombre -->
            <BaseInput v-model="provider.name" label="Nombre" placeholder="Proveedor" :error="nameError"
                @blur="$v.name.$touch()" />

            <!-- Direccion -->
            <BaseTextarea v-model="provider.address" label="Dirección" placeholder="Dirección del proveedor"
                :error="addressError" @blur="$v.address.$touch()" />

            <!-- Image -->
            <input type="file" @change="handleImage" class="file-input file-input-bordered w-full max-w-xs" />

            <!-- Botones -->
            <BaseFormContainerActions @close="closeForm" @save="saveData" :is-editing="isEditing"
                :is-form-valid="isFormValid" />
        </div>
    </dialog>
</template>