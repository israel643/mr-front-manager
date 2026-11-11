<script setup>
import { IconEye, IconEyeOff } from '@tabler/icons-vue'
import { ref } from 'vue';

const props = defineProps({
    modelValue: {
        type: [String],
        default: '',
    },
    label: {
        type: String,
        required: true,
    },
    error: {
        type: String
    },
});
const emit = defineEmits(['update:modelValue', 'blur']);
const showPassword = ref(false);
</script>

<template>
    <div class="mb-4 w-full">
        <label class="block text-sm font-medium text-base-content mb-1">{{ label }}</label>
        <div class="relative">
            <input :type="showPassword ? 'text' : 'password'" :value="modelValue" placeholder="•••••••••••"
                class="input input-bordered w-full" @input="$emit('update:modelValue', $event.target.value)"
                @blur="$emit('blur')" />
            <button type="button" class="absolute z-10 right-0 btn btn-square btn-soft btn-ghost"
                @click="showPassword = !showPassword" tabindex="-1">
                <IconEye class="w-[1.5rem] h-[1.5rem]" :class="!showPassword ? 'block' : 'hidden'" />
                <IconEyeOff class="w-[1.5rem] h-[1.5rem]" :class="showPassword ? 'block' : 'hidden'" />
            </button>
        </div>
        <p v-if="error" class="text-error text-sm mt-1">{{ error }}</p>
    </div>
</template>