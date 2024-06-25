<template>
  <div v-if="store.show" class="fixed bottom-0 left-0 right-0 top-0 z-20">
    <Transition name="back-blur">
      <div
        v-if="show"
        class="absolute bottom-0 left-0 right-0 top-0 cursor-pointer bg-black/20 backdrop-blur"
        @click="close"
      ></div>
    </Transition>

    <Transition name="move-up-center">
      <div
        v-if="show"
        class="no-scrollbar absolute left-1/2 top-1/2 flex max-h-[calc(100vh-32px)] w-[calc(100vw-32px)] -translate-x-1/2 -translate-y-1/2 justify-center overflow-auto rounded-md drop-shadow-xl sm:w-fit"
      >
        <component :is="store.component" v-model:data="store.data"></component>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { useOverlay } from '~/stores/overlay'
import { usePostStore } from '~/stores/post'

const store = useOverlay()

const show = ref(false)

watch(
  () => store.show,
  (newVal) => {
    if (newVal) {
      setTimeout(() => {
        show.value = true
      }, 100)
    }

    if (!usePostStore().boardShow) {
      if (newVal) {
        document.body.style.overflow = 'hidden'
      } else {
        document.body.style.overflow = ''
      }
    }
  },
)

const close = () => {
  show.value = false

  setTimeout(() => {
    store.show = false
  }, 500)
}
</script>
