<script setup>
import { ref, watch, computed, reactive } from 'vue'
import useVuelidate from '@vuelidate/core';

import { passwordRules } from '@/validators/passwordRules';
import { getValidationError } from '@/composables/useValidationMessages';

import BaseCloseModalButton from './BaseCloseModalButton.vue';
import BaseInputPassword from './BaseInputPassword.vue';
import BaseFormContainerActions from './BaseFormContainerActions.vue';

const props = defineProps(['open', 'userName']);
const emit = defineEmits(['save', 'close'])
const data = reactive({ password: '', confirmPassword: '' });

const rules = computed(() => passwordRules(data.password));
const $v = useVuelidate(rules, data);
const isFormValid = computed(() => !$v.value.$invalid);

const passwordError = computed(() =>
    getValidationError($v.value.password, {
        required: 'Campo obligatorio',
        strongPassword: 'La contraseña debe tener al menos 8 caracteres, una mayúscula, una minúscula, un número y un carácter especial',
    })
);

const confirmError = computed(() =>
    getValidationError($v.value.confirmPassword, {
        required: 'Campo obligatorio',
        sameAsPassword: 'Las contraseñas no coinciden'
    })
);

function closeForm() {
    $v.value.$reset();
    emit('close');
    data.password = '';
    data.confirmPassword = '';
}

const saveData = () => {
    $v.value.$touch();
    if (!$v.value.$invalid) {
        emit('save', data.password);
        data.password = '';
        data.confirmPassword = '';
        $v.value.$reset();
    }
}
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-2xl">
            <h2 class="text-2xl font-bold mb-4">Cambiar contraseña de {{ userName }}</h2>
            <BaseCloseModalButton @close="closeForm" />

            <div class="w-full flex flex-col sm:flex-row gap-x-4 gap-y-1">
                <div class="flex-1">
                    <BaseInputPassword v-model="data.password" label="Contraseña" :error="passwordError"
                        @blur="$v.password.$touch()" />
                </div>
                <div class="flex-1">
                    <BaseInputPassword v-model="data.confirmPassword" label="Confirmación" :error="confirmError"
                        @blur="$v.confirmPassword.$touch()" />
                </div>
            </div>

            <BaseFormContainerActions @close="closeForm" @save="saveData" :is-editing="false"
                :is-form-valid="isFormValid" />
        </div>
    </dialog>
</template>
