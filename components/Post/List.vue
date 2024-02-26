<template>
  <div v-if="store.posts" class="flex w-full flex-col gap-10">
    <TransitionGroup name="post-list">
      <PostCell
        v-for="post in store.posts"
        :key="post.id"
        :data="post"
        type="min"
      />
    </TransitionGroup>

    <div class="mb-10 flex justify-center">
      <button
        v-if="!noMore"
        class="text-xl text-gray-500"
        :class="loading ? 'ri-loader-4-line animate-spin' : 'ri-more-line'"
        @click="getMorePosts"
      ></button>
    </div>
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

// Get More Posts
const loading = ref(false)
const noMore = ref(false)

const getMorePosts = async () => {
  loading.value = true

  const newPosts = await store.getPosts()

  if (newPosts.length < store.pageSize) noMore.value = true

  store.posts = [...store.posts, ...newPosts]

  loading.value = false
}
</script>

<style>
.post-list-move,
.post-list-enter-active,
.post-list-leave-active {
  transition: all 0.4s;
}

.post-list-enter-from,
.post-list-leave-to {
  opacity: 0;
  transform: translateY(20px);
}

.post-list-leave-active {
  position: absolute;
}
</style>
