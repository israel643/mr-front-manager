<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number],
        required: false,
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
    type: {
        type: String,
        default: 'text'
    },
    min: {
        type: Number,
    },
    step: {
        type: Number,
    },
    error: {
        type: String
    },
});
const emit = defineEmits(['update:modelValue', 'blur']);
</script>

<template>
    <div class="mb-4 w-full">
        <label class="block text-md font-medium mb-1">{{ label }}</label>
        <input :type="type" :placeholder="placeholder" :value="modelValue" class="input input-bordered w-full"
            @input="$emit('update:modelValue', $event.target.value)" @blur="$emit('blur')" :min="min" :step="step" />
        <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
    </div>
</template>