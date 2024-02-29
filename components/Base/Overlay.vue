<template>
  <Transition name="fade">
    <div
      v-if="store.show"
      class="fixed bottom-0 left-0 right-0 top-0 z-20 cursor-pointer bg-black/50"
      @click="store.handleHide"
    ></div>
  </Transition>

  <Transition name="overlay-up">
    <div
      v-if="store.show"
      class="no-scrollbar fixed left-2/4 top-2/4 z-20 flex max-h-screen w-full max-w-3xl -translate-x-2/4 -translate-y-2/4 justify-center overflow-auto sm:w-fit"
    >
      <slot :data="store.data" />
    </div>
  </Transition>
</template>

<script setup>
import { useOverlay } from '~/stores/overlay'

const store = useOverlay()
</script>

<style>
.overlay-up-enter-active,
.overlay-up-leave-active {
  transition:
    transform 0.3s,
    opacity 0.3s;
}

.overlay-up-enter-from,
.overlay-up-leave-to {
  transform: translate(-50%, 10px);
  opacity: 0;
}
</style>
