<template>
  <div class="w-full">
    <div class="c-bg-page sticky top-16 z-10 py-4">
      <BaseInput
        type="text"
        placeholder="搜索"
        v-model="input"
        icon="ri-close-line"
        :loading="loading"
        auto-focus
        @keyup.enter="search"
        @confirm="clear"
      />
    </div>

    <PostList
      v-if="posts"
      v-model:posts="posts"
      v-model:page="page"
      :ilike="input"
      class="mt-10"
    />

    <BaseDefault v-if="!posts" />
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const store = usePostStore()

const route = useRoute()

const input = ref(route.query.q || '')

onMounted(() => {
  if (route.query?.q) {
    search()
  }
})

const posts = ref(null)

const loading = ref(false)

const page = ref(2)

const search = async () => {
  if (!input.value) return

  navigateTo(`/search?q=${input.value}`, {
    replace: true,
  })

  loading.value = true

  posts.value = await store.getPosts({ ilike: input.value })

  if (!posts.value.length) posts.value = null

  loading.value = false
}

const clear = () => {
  input.value = null
}
</script>
