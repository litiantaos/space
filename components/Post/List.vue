<template>
  <div v-if="posts" class="flex w-full flex-col gap-10">
    <TransitionGroup name="post-list">
      <PostCell v-for="post in posts" :key="post.id" :data="post" type="min" />
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

const posts = defineModel('posts')

const page = defineModel('page')

const props = defineProps(['ilike'])

// Get More Posts
const loading = ref(false)
const noMore = ref(false)

if (posts.value?.length < store.pageSize) noMore.value = true

const getMorePosts = async () => {
  loading.value = true

  let obj = {
    page: page.value,
  }

  if (props.ilike) {
    obj.ilike = props.ilike
  }

  const newPosts = await store.getPosts(obj)

  page.value++

  if (newPosts.length < store.pageSize) noMore.value = true

  posts.value = [...posts.value, ...newPosts]

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
