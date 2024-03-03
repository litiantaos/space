<template>
  <Transition name="fade">
    <div
      v-if="store.show"
      class="fixed bottom-0 left-0 right-0 top-0 z-30 cursor-pointer bg-black/50"
      @click="() => (store.show = false)"
    ></div>
  </Transition>

  <Transition name="move-up-center">
    <div
      v-if="store.show"
      class="no-scrollbar fixed left-2/4 top-2/4 z-30 flex max-h-screen w-[calc(100vw-32px)] -translate-x-2/4 -translate-y-2/4 justify-center overflow-auto drop-shadow-xl sm:w-fit"
    >
      <component :is="store.component" v-model:data="store.data"></component>
    </div>
  </Transition>
</template>

<script setup>
import { useOverlay } from '~/stores/overlay'

const store = useOverlay()
</script>
