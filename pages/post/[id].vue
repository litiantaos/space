<template>
  <div class="w-full">
    <div class="flex flex-col gap-5">
      <h1 v-if="title" class="c-text-base py-5 text-3xl font-bold">
        {{ title }}
      </h1>

      <PostCell v-if="post" :data="post" @title="getTitle" :key="cellKey" />
    </div>

    <div class="flex flex-col items-center gap-14 py-14">
      <button class="ri-chat-2-line btn-circle" @click="citePost"></button>

      <div v-if="citedPosts?.length" class="flex w-full flex-col gap-10">
        <div
          class="c-text-base border-b py-4 text-lg font-bold dark:border-slate-700"
        >
          来自引用
        </div>

        <PostList
          v-if="citedPosts"
          v-model:posts="citedPosts"
          v-model:page="store.currentPage"
          hideCitedPost
        />
      </div>
    </div>

    <BaseLoading :loading="pageLoading" />
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'
import mediumZoom from 'medium-zoom'

const store = usePostStore()

const id = useRoute().params.id
const cellKey = ref(0)

// Get Data
const post = ref(null)
const pageLoading = ref(false)

if (store.localPost) {
  post.value = store.localPost
  store.localPost = null
} else {
  pageLoading.value = true

  const { data } = await useAsyncData(async () => {
    return await store.getPost(id)
  })

  if (!data.value) {
    throw createError({
      statusCode: 404,
      statusMessage: 'Page Not Found',
    })
  }

  post.value = data.value
}

watch(
  () => [store.cited, store.editedPost],
  ([newCited, newEditedPost]) => {
    if (newCited) {
      getCitedPosts()
    }

    if (newEditedPost) {
      post.value = e
      cellKey.value++
    }
  },
)

// Get CitedPosts
const citedPosts = ref(null)

const getCitedPosts = async () => {
  citedPosts.value = await store.getPosts({
    cite: ['cited_post_id', post.value.id],
  })

  pageLoading.value = false
}

// Cite Post
const citePost = () => {
  store.boardShow = true
  store.citedPostId = post.value.id
}

// Title
const title = ref(null)

const getTitle = (e) => {
  title.value = e
}

// SEO
const getSeoTitle = (html) => {
  const h1Regex = /^<h1>(.*?)<\/h1>/
  const pRegex = /<p>(.*?)<\/p>/

  const h1Match = html.match(h1Regex)

  if (h1Match) {
    return h1Match[1]
  } else {
    const pMatch = html.match(pRegex)

    if (pMatch) {
      return pMatch[1]
    } else {
      return ''
    }
  }
}

if (post.value) {
  const seoTitle = getSeoTitle(post.value.content)
  const seoDesc = post.value.content.replace(/<[^>]+>/g, '').trim()

  useSeoMeta({
    title: seoTitle,
    description: seoDesc,
  })
}

onMounted(async () => {
  if (post.value) getCitedPosts()

  // Medium Zoom
  const theme = localStorage.getItem('theme')

  await nextTick()

  mediumZoom('[zoomable]', {
    background: theme === 'light' ? '#fff' : '#000',
  })
})

onBeforeUnmount(() => {
  store.editablePost = null
})
</script>
