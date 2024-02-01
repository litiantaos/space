<template>
  <div class="w-full">
    <div class="sticky top-16 z-10 bg-white py-4">
      <BaseInput
        type="text"
        placeholder="搜索"
        v-model="keywords"
        icon="ri-close-line"
        auto-focus
        @keyup.enter="search"
        @confirm="clear"
      />
    </div>

    <div v-if="posts" class="my-6 flex w-full flex-col gap-6">
      <PostCell v-for="post in posts" :key="post.id" :data="post" />
    </div>
  </div>
</template>

<script setup>
const keywords = ref(null)

const posts = ref(null)

const search = async () => {
  if (!keywords.value) return

  const { data } = await useSupabaseClient()
    .from('posts')
    .select('*, profiles(id, nickname, avatar_url)')
    .ilike('content', `%${keywords.value}%`)

  // console.log(data)

  posts.value = data
}

const clear = () => {
  keywords.value = null
}
</script>
