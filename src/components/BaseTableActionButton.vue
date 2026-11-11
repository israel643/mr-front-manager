<script setup>
const props = defineProps({
    icon: {
        type: [Object, Function],
        required: true
    },
    color: {
        type: String,
        default: 'secondary',
    },
    tooltip: {
        type: String,
        required: true,
    }
});
const emit = defineEmits(['click']);
</script>

<template>
    <button class="btn btn-soft btn-square btn-sm btn-secondary" @click="$emit('click')" :title="tooltip">
        <component :is="icon" class="w-4 h-4" />
    </button>
</template>
