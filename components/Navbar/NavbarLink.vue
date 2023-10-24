<script setup lang="ts">
defineProps({
  href: { type: String, required: true },
  active: { type: Boolean, required: true },
});
</script>

<template>
  <NuxtLink
    :to="href"
    preserve-state
    class="inline-flex items-center justify-center w-full h-full py-4 font-medium text-center transition-colors rounded-lg"
    :class="active ? 'bg-main-secondary' : 'hover:text-main-primary'"
  >
    <slot />
  </NuxtLink>
</template>
