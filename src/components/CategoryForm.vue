<script setup>
import { reactive, watch, computed } from 'vue';
import useVuelidate from '@vuelidate/core';

import { Category } from '@/models/Category';
import { categoryRules } from '@/validators/categoryRules';
import { getValidationError } from '@/composables/useValidationMessages';

import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseFormContainerActions from '@/components/BaseFormContainerActions.vue';

const emit = defineEmits(['save', 'close']);
const props = defineProps(['open', 'isEditing', 'initialCategory']);

const baseCategory = new Category();
const category = reactive({ ...baseCategory });

watch(() => props.initialCategory, (newVal) => {
    Object.assign(category, newVal || baseCategory);
}, { immediate: true });

const $v = useVuelidate(categoryRules, category);
const isFormValid = computed(() => !$v.value.$invalid);

const nameError = computed(() =>
    getValidationError($v.value.name, {
        required: 'Campo obligatorio'
    })
);

function closeForm() {
    $v.value.$reset();
    emit('close')
}

function saveData() {
    $v.value.$touch();
    if (!$v.value.$invalid) {
        emit('save', { ...category });
        $v.value.$reset();
    }
}
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-2xl">
            <h2 class="text-2xl font-bold mb-4">
                {{ `${isEditing ? 'Editar' : 'Agregar'} categoria` }}
            </h2>
            <BaseCloseModalButton @close="closeForm" />

            <!-- Oculto (Id, Status) -->
            <input type="hidden" v-model="category.id" />
            <input type="hidden" v-model="category.active" />

            <!-- Nombre -->
            <BaseInput v-model="category.name" label="Nombre" placeholder="Categoria" :error="nameError"
                @blur="$v.name.$touch()" />

            <!-- Botones -->
            <BaseFormContainerActions @close="closeForm" @save="saveData" :is-editing="isEditing"
                :is-form-valid="isFormValid" />
        </div>
    </dialog>
</template>