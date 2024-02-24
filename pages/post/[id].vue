<template>
  <div class="w-full">
    <div class="flex flex-col gap-5">
      <h1 v-if="title" class="py-5 text-3xl font-bold text-gray-600">
        {{ title }}
      </h1>

      <PostCell :data="post" @title="getTitle" />
    </div>

    <div class="flex flex-col items-center gap-14 py-14">
      <button
        class="ri-chat-new-line h-12 w-12 rounded-full bg-slate-100 text-slate-500 transition-all duration-300 active:scale-110"
        @click="citePost"
      ></button>

      <div v-if="citedPosts?.length" class="flex w-full flex-col gap-10">
        <div class="border-b py-4 text-lg font-bold text-gray-600">
          来自引用
        </div>

        <PostCell
          v-for="citedPost in citedPosts"
          :key="citedPost.id"
          :data="citedPost"
          hideCitedPost
        />
      </div>
    </div>

    <PostBoard @cited="onCited" />

    <BaseLoading :loading="pageLoading" />
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'
import mediumZoom from 'medium-zoom'

const store = usePostStore()
const client = useSupabaseClient()

const id = useRoute().params.id

// Get Data
const post = ref(null)
const pageLoading = ref(false)

if (store.localPost) {
  post.value = store.localPost
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
  const { data } = await client
    .from('posts')
    .select('*, profiles(id, nickname, avatar_url)')
    .eq('cited_post_id', post.value.id)
    .order('created_at', { ascending: false })

  citedPosts.value = data

  pageLoading.value = false
}

onMounted(async () => {
  getCitedPosts()

  // Medium Zoom
  await nextTick()
  mediumZoom('[type="img"]')
})

onBeforeUnmount(() => {
  store.editablePost = null
})

// On Post Cited
const onCited = () => {
  getCitedPosts()
}

// Cite Post
const citePost = () => {
  store.isBoardShow = true
  store.citedPostId = post.value.id
}

// Title
const title = ref(null)

const getTitle = (e) => {
  title.value = e
}

// Scroll Hidden
watch(
  () => store.isBoardShow,
  (value) => {
    if (value) {
      document.body.style.overflow = 'hidden'
    } else {
      document.body.style.overflow = ''
    }
  },
)

// SEO
const seoTitle = post.value.content.replace(/<[^>]*>?/gm, '')

useSeoMeta({
  title: seoTitle,
})
</script>
