<script setup>
import { useRoute, useRouter } from 'vue-router'

const props = defineProps(['icon','name','route','currentPath'])

const router = useRouter()

const handleClick = () => {
  router.push(props.route)
}
</script>

<template>
  <li>
    <a
      @click="handleClick"
      :class="[
        'flex items-center gap-3 px-4 py-2 transition-colors rounded-lg',
        currentPath === route ? 'bg-primary text-base-200 font-semibold' : 'text-base-content hover:bg-base-200'
      ]"
    >
      <component :is="icon" size="25" />
      <span>{{ name }}</span>
    </a>
  </li>
</template>
