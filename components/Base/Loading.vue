<template>
  <Transition name="fade">
    <div
      v-if="loading"
      class="bottom-0 left-0 right-0 top-0 z-40 flex select-none items-center justify-center"
      :class="[type, type === 'fixed' ? 'bg-white' : 'bg-white/75']"
    >
      <div
        v-if="!custom"
        class="ri-loader-4-line animate-spin text-xl text-gray-700"
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
