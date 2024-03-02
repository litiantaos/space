<template>
  <div class="w-full">
    <div
      class="sticky top-16 z-10 flex items-center gap-5 overflow-auto bg-white py-4 text-xl text-gray-400"
    >
      <TransitionGroup name="post-list">
        <button
          v-for="(tag, idx) in tags"
          :key="tag.id"
          :class="{ 'font-bold text-gray-500': idx === 0 }"
          @click="checkTag(idx)"
        >
          {{ tag.name }}
        </button>
      </TransitionGroup>
    </div>

    <PostList
      v-model:posts="posts"
      v-model:page="page"
      :key="listKey"
      class="mt-10"
    />

    <BaseDefault v-if="!posts" />

    <BaseLoading :loading="pageLoading" />
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

// Check Tag
const checkTag = (index) => {
  if (index >= 0 && index < tags.value.length) {
    const item = tags.value.splice(index, 1)[0]

    tags.value.unshift(item)

    getTagPosts(tags.value[0].id)
  }
}

// Get Tag Posts
const posts = ref(null)

const getTagPosts = async (tagId) => {
  pageLoading.value = true

  const { data } = await client
    .from('posts_tags')
    .select('post_id, tags(name)')
    .eq('tag_id', tagId)

  const postIds = data.map((item) => item.post_id)

  if (postIds.length) {
    posts.value = await store.getPosts({ inArr: postIds })
    listKey.value++
  } else {
    posts.value = null
  }

  pageLoading.value = false
}

onMounted(async () => {
  const currentTagIndex = tags.value.findIndex((item) => item.id === Number(id))

  checkTag(currentTagIndex)
})
</script>
