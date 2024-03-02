<template>
  <Transition name="fade">
    <div
      v-if="loading"
      class="bottom-0 left-0 right-0 top-0 z-40 flex select-none items-center justify-center bg-white"
      :class="[type, { 'opacity-75': type !== 'fixed' }]"
    >
      <div class="ri-loader-4-line animate-spin text-xl text-gray-700"></div>
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
})
</script>
