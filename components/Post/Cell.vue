<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <NuxtLink
        :to="`/${data.users?.id}`"
        class="flex items-center gap-3 text-sm"
      >
        <img
          :src="data.users?.avatar_url || defaultAvatarUrl"
          class="h-6 w-6 overflow-hidden rounded-full border object-cover"
        />

        <div class="text-gray-800">
          {{ data.users?.nickname || defaultNickname }}
        </div>

        <div class="text-gray-400">
          {{ formatTime(data.created_at) }}
        </div>

        <div
          v-if="recommended"
          class="ri-heart-fill leading-4 text-slate-400"
        ></div>
      </NuxtLink>

      <ClientOnly>
        <BasePopover
          :options="{
            placement: 'top-end',
            theme: 'base',
          }"
        >
          <button
            v-if="user && user.id === data.users.user_id"
            class="ri-more-line btn-base"
          ></button>

          <template #content>
            <div class="flex gap-1">
              <button
                v-if="data.users.role === 'admin'"
                class="btn-base"
                :class="
                  recommended
                    ? 'ri-heart-fill'
                    : loading
                      ? 'ri-loader-4-line animate-spin'
                      : 'ri-heart-line'
                "
                @click="topPost"
              ></button>

              <button
                class="ri-image-circle-line btn-base"
                @click="capture"
              ></button>

              <button class="ri-edit-line btn-base" @click="editPost"></button>

              <button
                class="ri-delete-bin-7-line btn-base text-red-500"
                @click="delPost"
              ></button>
            </div>
          </template>
        </BasePopover>
      </ClientOnly>
    </div>

    <div v-if="tags?.length" class="mt-3 flex items-center gap-2">
      <div class="tag bg-slate-100/85" v-for="tag in tags">{{ tag.name }}</div>
    </div>

    <div v-if="content" class="flex flex-col gap-2">
      <div
        :class="[
          { 'relative h-[600px] overflow-hidden': hidden },
          { 'cursor-pointer': type === 'min' },
        ]"
        @click="toPost"
      >
        <div v-html="content" class="html-style"></div>

        <div
          v-if="hidden"
          class="ri-more-line absolute bottom-0 left-0 right-0 flex h-48 items-end justify-center bg-gradient-to-t from-white to-transparent pb-3 text-xl"
        ></div>
      </div>

      <NuxtLink
        v-if="data.cited_post_id && !hideCitedPost"
        :to="`/post/${data.cited_post_id}`"
        class="flex h-8 w-fit items-center justify-center gap-3 rounded-md bg-gray-100 px-2 text-xs"
      >
        引用原文
        <div class="ri-arrow-right-line text-sm"></div>
      </NuxtLink>
    </div>
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'
import { useToast } from '~/stores/toast'
import { hideAll } from 'tippy.js'
import { useOverlay } from '~/stores/overlay'

const store = usePostStore()
const client = useSupabaseClient()
const user = useSupabaseUser()

const props = defineProps({
  data: Object,
  hideCitedPost: Boolean,
  type: String,
})

const emit = defineEmits(['title'])

// Tags
const tags = ref(null)

const { data: tagRes } = await client
  .from('posts_tags')
  .select('post_id, tags(id, name)')
  .eq('post_id', props.data.id)

tags.value = tagRes.map((item) => item.tags)

// Delete
// const deleting = ref(false)

const delPost = () => {
  useToast().push({
    type: 'action',
    text: '确定要删除帖子吗？',
    action: () => deletePost(),
  })
}

const deletePost = throttle(async () => {
  useToast().loading = true

  try {
    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', props.data.id)

    if (error) throw error

    useToast().loading = false
    useToast().show = false

    deleteLocalPost()

    if (useRoute().path !== '/') {
      navigateTo('/')
    }
  } catch (error) {
    alert(error.message)
  }
}, 2000)

const deleteLocalPost = () => {
  const index = store.posts.findIndex((x) => x.id === props.data.id)

  if (index !== -1) {
    store.posts.splice(index, 1)
  }
}

// Edit
const editPost = () => {
  store.boardShow = true
  store.editablePost = props.data
  store.editablePost.tags = tags.value

  hideAll()
}

// Top
const recommended = ref(props.data.is_recommended)
const loading = ref(false)

const topPost = async () => {
  loading.value = true

  try {
    await client
      .from('posts')
      .update({
        is_recommended: !props.data.is_recommended,
      })
      .eq('id', props.data.id)

    recommended.value = !props.data.is_recommended
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

// Process HTML
onMounted(() => {
  processHtml(props.data.content)
})

const content = ref(null)
const hidden = ref(false)

const processHtml = (htmlString) => {
  const regex = /^<h1>(.*?)<\/h1>/
  const match = htmlString.match(regex)

  if (match) {
    if (props.type === 'min') {
      hidden.value = true
      content.value = props.data.content
    } else {
      content.value = htmlString.replace(regex, '')
      emit('title', match[1])
    }
  } else {
    content.value = props.data.content
  }
}

const toPost = () => {
  if (props.type !== 'min') return

  store.localPost = props.data

  navigateTo('/post/' + props.data.id)
}

const capture = () => {
  const overlay = useOverlay()

  overlay.handleShow()
  overlay.data = props.data
  overlay.data.tags = tags.value
}
</script>

<style>
.btn-base {
  @apply h-8 w-8 rounded active:bg-gray-100;
}
</style>
