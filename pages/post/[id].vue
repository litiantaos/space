<template>
  <div class="w-full">
    <div class="flex flex-col gap-5">
      <h1 v-if="title" class="c-text-base py-5 text-3xl font-bold">
        {{ title }}
      </h1>

      <PostCell :data="post" @title="getTitle" :key="cellKey" />
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
          v-model:posts="citedPosts"
          v-model:page="store.currentPage"
          hideCitedPost
        />
      </div>
    </div>

    <PostBoard @cited="onCited" @edited="onEdited" />

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

  post.value = data.value
}

// Get CitedPosts
const citedPosts = ref(null)

const getCitedPosts = async () => {
  citedPosts.value = await store.getPosts({
    cite: ['cited_post_id', post.value.id],
  })

  pageLoading.value = false
}

onMounted(async () => {
  getCitedPosts()

  // Medium Zoom
  await nextTick()
  mediumZoom('[zoomable]')
})

onBeforeUnmount(() => {
  store.editablePost = null
})

// On Post Cited
const onCited = () => {
  getCitedPosts()
}

// On Post Edited
const onEdited = (e) => {
  post.value = e
  cellKey.value++
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
let seoTitle = post.value.content.replace(/<\/[^>]+>/g, ' ')
seoTitle = seoTitle.replace(/<[^>]+>/g, '')

useSeoMeta({
  title: seoTitle,
})
</script>
