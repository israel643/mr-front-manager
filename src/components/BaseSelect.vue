<script setup>
const props = defineProps({
    modelValue: {
        type: [String, Number, null],
        default: null,
    },
    label: {
        type: String,
    },
    placeholder: {
        type: String,
        default: "Selecciona una opción"
    },
    options: {
        type: Array,
    },
    disabled: {
        type: Boolean,
    },
    error: {
        type: String,
    }
});
const emit = defineEmits(['update:modelValue', 'blur']);

function onChange(event) {
    const value = event.target.value;
    emit('update:modelValue', value === '' ? null : value);
}
</script>

<template>
    <div class="mb-4 w-full">
        <label class="block text-md font-medium mb-1">{{ label }}</label>
        <select :value="modelValue ?? ''" @change="onChange" class="select w-full"
            :disabled="disabled" @blur="$emit('blur')">
            <option value="" disabled>{{ placeholder }}</option>
            <option v-for="item in options" :key="item.id" :value="item.id">
                {{ item.name }}
            </option>
        </select>
        <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
    </div>
</template>
