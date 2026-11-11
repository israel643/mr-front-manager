<script setup>
import { reactive, watch, computed, ref } from 'vue';
import useVuelidate from '@vuelidate/core';

import { Brand } from '@/models/Brand';
import { brandRules } from '@/validators/brandRules';
import { getValidationError } from '@/composables/useValidationMessages';

import BaseCloseModalButton from './BaseCloseModalButton.vue';
import BaseInput from './BaseInput.vue';
import BaseFormContainerActions from './BaseFormContainerActions.vue';

const props = defineProps(['open', 'isEditing', 'initialBrand']);
const emit = defineEmits(['save', 'close']);

const baseBrand = new Brand();
const brand = reactive({ ...baseBrand });
const imageFile = ref(null);

watch(() => props.initialBrand, (newVal) => {
    Object.assign(brand, newVal || baseBrand);
}, { immediate: true });

const $v = useVuelidate(brandRules, brand);
const isFormValid = computed(() => !$v.value.$invalid);

const nameError = computed(() =>
    getValidationError($v.value.name, {
        required: 'Campo obligatorio'
    })
);

const handleImage = (e) => {
    imageFile.value = e.target.files[0];
};

function closeForm() {
    $v.value.$reset();
    emit('close');
};

function saveData() {
    $v.value.$touch();
    if (!$v.value.$invalid) {
        const formData = new FormData();
        if (brand.id) formData.append('id', brand.id);
        formData.append('name', brand.name);
        formData.append('active', brand.active);
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
                {{ `${isEditing ? 'Editar' : 'Agregar'} marca` }}
            </h2>
            <BaseCloseModalButton @close="closeForm" />

            <!-- Oculto (Id, Status) -->
            <input type="hidden" v-model="brand.id" />
            <input type="hidden" v-model="brand.active" />

            <!-- Nombre -->
            <BaseInput v-model="brand.name" label="Nombre" placeholder="Marca" :error="nameError"
                @blur="$v.name.$touch()" />

            <!-- Image -->
            <input type="file" @change="handleImage" class="file-input file-input-bordered w-full max-w-xs" />

            <!-- Botones -->
            <BaseFormContainerActions @close="closeForm" @save="saveData" :is-editing="isEditing"
                :is-form-valid="isFormValid" />
        </div>
    </dialog>
</template>