<template>
  <div class="w-full">
    <div class="sticky top-16 z-10 bg-white py-4">
      <BaseInput
        type="text"
        placeholder="搜索"
        v-model="keywords"
        icon="ri-close-line"
        :loading="loading"
        auto-focus
        @keyup.enter="search"
        @confirm="clear"
      />
    </div>

    <div v-if="posts" class="my-6 flex w-full flex-col gap-10">
      <PostCell v-for="post in posts" :key="post.id" :data="post" type="min" />
    </div>
  </div>
</template>

<script setup>
const keywords = ref(null)

const posts = ref(null)

const loading = ref(false)

const search = async () => {
  if (!keywords.value) return

  loading.value = true

  const { data } = await useSupabaseClient()
    .from('posts')
    .select('*, users(id, user_id, nickname, avatar_url)')
    .ilike('content', `%${keywords.value}%`)

  // console.log(data)

  posts.value = data

  loading.value = false
}

const clear = () => {
  keywords.value = null
}
</script>
