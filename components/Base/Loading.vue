<template>
  <Transition name="fade">
    <div
      v-if="loading"
      class="bottom-0 left-0 right-0 top-0 z-40 flex select-none items-center justify-center"
      :class="[type, type === 'fixed' ? 'c-bg-page' : 'c-bg-page-opacity']"
    >
      <div
        v-if="!custom"
        class="ri-loader-4-line c-text-base animate-spin text-xl"
      ></div>
      <slot />
    </div>
  </Transition>
</template>

<script setup>
const props = defineProps({
  loading: {
    type: Boolean,
    default: true,
  },
  type: {
    type: String,
    default: 'fixed',
  },
  custom: {
    type: Boolean,
    default: false,
  },
})
</script>
