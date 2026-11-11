<script setup>
const props = defineProps(['isFormValid', 'isEditing']);
const emit = defineEmits(['close', 'save'])
</script>

<template>
    <div class="mt-6 flex justify-end space-x-3">
        <button @click="$emit('close')" class="btn btn-ghost">Cancelar</button>
        <button :disabled="!isFormValid" @click="$emit('save')" class="btn btn-primary">
            {{ isEditing ? 'Guardar Cambios' : 'Agregar' }}
        </button>
    </div>
</template>