<template>
  <div class="flex w-full flex-col items-center gap-16">
    <MainHeader />

    <KeepAlive>
      <PostList :key="store.listKey" />
    </KeepAlive>

    <PostBoard />

    <BaseLoading :loading="pageLoading" />
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'
import { useOverlay } from '~/stores/overlay'

const store = usePostStore()

// Loaded
const pageLoading = ref(true)

watch(
  () => store.posts,
  (value) => {
    if (value) {
      pageLoading.value = false
    }
  },
)

if (store.posts) {
  pageLoading.value = false
}

// Scroll Hidden
watch(
  () => [store.boardShow, useOverlay().show],
  ([newVal1, newVal2]) => {
    if (newVal1 || newVal2) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)
</script>
