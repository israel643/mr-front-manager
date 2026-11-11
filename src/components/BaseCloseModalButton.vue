<script setup>
import { IconXboxXFilled } from '@tabler/icons-vue';
const emit = defineEmits(['close']);
</script>

<template>
    <button @click="$emit('close')" class="btn btn-md btn-circle btn-ghost absolute right-2 top-2">
        <IconXboxXFilled class="w-[1.8rem] h-[1.8rem]" />
    </button>
</template>