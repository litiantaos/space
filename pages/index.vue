<template>
  <div class="flex w-full flex-col items-center gap-16">
    <MainHeader />

    <KeepAlive>
      <PostList
        v-model:posts="store.posts"
        v-model:page="store.currentPage"
        :key="store.listKey"
      />
    </KeepAlive>

    <PostBoard />
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const store = usePostStore()

onMounted(async () => {
  if (store.posts === null) {
    store.posts = await store.getPosts()
  }
})
</script>
