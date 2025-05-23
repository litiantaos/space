<template>
  <div class="w-full">
    <div
      ref="tagsRef"
      class="no-scrollbar c-text-base c-bg-page sticky top-16 z-10 flex items-center gap-5 overflow-x-auto py-4 text-xl"
    >
      <TransitionGroup name="list-move-left">
        <button
          v-for="(tag, idx) in tags"
          :key="tag.id"
          :class="['whitespace-nowrap', { 'c-text-base font-bold': idx === 0 }]"
          @click="handleTag(idx)"
        >
          {{ tag.name }}
        </button>
      </TransitionGroup>
    </div>

    <div class="relative mt-10 min-h-[calc(100vh-200px)]">
      <PostList v-model:posts="posts" v-model:page="page" :key="listKey" />

      <BaseDefault v-if="!posts && !pageLoading" class="absolute h-full" />

      <BaseLoading :loading="pageLoading" type="absolute" />
    </div>
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const store = usePostStore()

const client = useSupabaseClient()

const id = useRoute().params.id

const pageLoading = ref(true)

const page = ref(2)

const listKey = ref(0)

// Get All Tags
const tags = ref(null)

const tagsRes = await client.from('tags').select('id, name')

tags.value = tagsRes.data

// Handle Tag
const handleTag = (index) => {
  navigateTo(`/tag/${tags.value[index].id}`, {
    replace: true,
  })
}

// Sort Tag
const tagsRef = ref(null)

const sortTag = (index) => {
  if (index >= 0 && index < tags.value.length) {
    const item = tags.value.splice(index, 1)[0]

    tags.value.unshift(item)

    setTimeout(() => {
      if (tagsRef.value) {
        tagsRef.value.scrollTo({ left: 0, behavior: 'smooth' })
      }
    }, 500)
  }
}

// Get Tag Posts
const posts = ref(null)

const getTagPosts = async () => {
  pageLoading.value = true

  const { data } = await client
    .from('posts_tags')
    .select('post_id, tags(name)')
    .eq('tag_id', id)

  const postIds = data.map((item) => item.post_id)

  if (postIds.length) {
    posts.value = await store.getPosts({ inArr: postIds })
    listKey.value++
  } else {
    posts.value = null
  }

  pageLoading.value = false
}

getTagPosts()

onMounted(async () => {
  const currentTagIndex = tags.value.findIndex((item) => item.id === Number(id))

  sortTag(currentTagIndex)
})
</script>
