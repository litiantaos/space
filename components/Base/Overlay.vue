<template>
  <Transition name="page">
    <div v-if="store.show" class="fixed -top-10 bottom-0 left-0 right-0 z-30">
      <div
        class="absolute bottom-0 left-0 right-0 top-0 cursor-pointer bg-black/50"
        @click="() => (store.show = false)"
      ></div>
      <div
        class="no-scrollbar absolute left-1/2 top-[calc(50%+20px)] flex max-h-screen w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 justify-center overflow-auto rounded-md drop-shadow-xl transition-all sm:w-fit"
      >
        <component :is="store.component" v-model:data="store.data"></component>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { useOverlay } from '~/stores/overlay'
import { usePostStore } from '~/stores/post'

const store = useOverlay()

watch(
  () => store.show,
  (newVal) => {
    if (!usePostStore().boardShow) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
)
</script>
