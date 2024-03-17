<template>
  <Transition name="page">
    <div
      v-if="store.show"
      class="fixed -top-10 bottom-0 left-0 right-0 z-30 flex cursor-pointer items-center justify-center bg-black/50 pt-10"
      @click="() => (store.show = false)"
    >
      <div
        class="no-scrollbar flex max-h-screen w-[calc(100vw-32px)] justify-center overflow-auto drop-shadow-xl transition-all sm:w-fit"
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
