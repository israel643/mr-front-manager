<script setup>
import BaseCloseModalButton from '@/components/BaseCloseModalButton.vue';

const props = defineProps(['title', 'message', 'confirmText', 'cancelText', 'open']);
const emit = defineEmits(['confirm', 'cancel']);
</script>

<template>
    <dialog class="modal" :open="open">
        <div class="modal-box">
            <BaseCloseModalButton @close="$emit('cancel')" />
            <h3 class="font-bold text-lg">{{ title }}</h3>
            <p class="py-4">{{ message }}</p>
            <div class="modal-action">
                <button class="btn" @click="$emit('cancel')">{{ cancelText }}</button>
                <button class="btn btn-primary" @click="$emit('confirm')">{{ confirmText }}</button>
            </div>
        </div>
    </dialog>
</template>
