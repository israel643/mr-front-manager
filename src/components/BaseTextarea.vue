<script setup>
const props = defineProps({
    modelValue: {
        type: String,
        required: true,
        default: '',
    },
    label: {
        type: String,
        required: true,
    },
    placeholder: {
        type: String,
        required: true,
    },
    error: {
        type: String,
    },
});
const emit = defineEmits(['update:modelValue', 'blur']);
</script>

<template>
    <div class="mb-4 w-full">
        <label class="block text-md font-medium mb-1">{{ label }}</label>
        <textarea :value="modelValue" @input="$emit('update:modelValue', $event.target.value)"
            :placeholder="placeholder" class="textarea textarea-md w-full" @blur="$emit('blur')" />
        <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
    </div>
</template>
