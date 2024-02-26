<template>
  <Transition name="load-fade">
    <div
      v-if="loading"
      class="fixed bottom-0 left-0 right-0 top-0 z-40 flex items-center justify-center bg-white"
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
})
</script>

<style>
.load-fade-enter-active,
.load-fade-leave-active {
  transition: opacity 0.4s;
}

.load-fade-enter-from,
.load-fade-leave-to {
  opacity: 0;
}
</style>
