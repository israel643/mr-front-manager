<script setup>
import { reactive, watch, computed } from 'vue';
import useVuelidate from '@vuelidate/core';

import { Measurement } from '@/models/Measurement';
import { measurementRules } from '@/validators/measurementRules';
import { getValidationError } from '@/composables/useValidationMessages';

import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';
import BaseInput from '@/components/BaseInput.vue';
import BaseFormContainerActions from '@/components/BaseFormContainerActions.vue';

const emit = defineEmits(['save', 'close']);
const props = defineProps(['open', 'isEditing', 'initialMeasurement']);

const baseMeasurement = new Measurement();
const measurement = reactive({ ...baseMeasurement });

watch(() => props.initialMeasurement, (newVal) => {
    Object.assign(measurement, newVal || baseMeasurement);
}, { immediate: true });

const $v = useVuelidate(measurementRules, measurement);
const isFormValid = computed(() => !$v.value.$invalid);

const nameError = computed(() =>
    getValidationError($v.value.name, {
        required: 'Campo obligatorio'
    })
);

const abbreviationError = computed(() =>
    getValidationError($v.value.abbreviation, {
        required: 'Campo obligatorio',
        maxLength: 'Máximo 10 caracteres'
    })
);

function closeForm() {
    $v.value.$reset();
    emit('close')
}

function saveData() {
    $v.value.$touch();
    if (!$v.value.$invalid) {
        emit('save', { ...measurement });
        $v.value.$reset();
    }
}
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box max-w-2xl">
            <h2 class="text-2xl font-bold mb-4">
                {{ `${isEditing ? 'Editar' : 'Agregar'} medida` }}
            </h2>
            <BaseCloseModalButton @close="closeForm" />

            <!-- Oculto (Id, Status) -->
            <input type="hidden" v-model="measurement.id" />
            <input type="hidden" v-model="measurement.active" />

            <!-- Nombre -->
            <BaseInput v-model="measurement.name" label="Nombre" placeholder="Medida" :error="nameError"
                @blur="$v.name.$touch()" />

            <!-- Abreviatura -->
            <BaseInput v-model="measurement.abbreviation" label="Nombre" placeholder="Abreviación"
                :error="abbreviationError" @blur="$v.abbreviation.$touch()" />

            <!-- Botones -->
            <BaseFormContainerActions @close="closeForm" @save="saveData" :is-editing="isEditing"
                :is-form-valid="isFormValid" />
        </div>
    </dialog>
</template>