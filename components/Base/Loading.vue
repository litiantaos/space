<template>
  <Transition>
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
.v-enter-active,
.v-leave-active {
  transition: opacity 0.4s;
}

.v-enter-from,
.v-leave-to {
  opacity: 0;
}
</style>
