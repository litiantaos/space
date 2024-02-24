<template>
  <div class="flex flex-col gap-2">
    <div class="flex items-center justify-between">
      <div class="flex items-center gap-3 text-sm">
        <img
          :src="data.profiles?.avatar_url || defaultAvatarUrl"
          class="h-6 w-6 overflow-hidden rounded-full border object-cover"
        />

        <div class="text-gray-800">
          {{ data.profiles?.nickname || defaultNickname }}
        </div>

        <div class="text-gray-400">
          {{ formatTime(data.created_at) }}
        </div>

        <div
          v-if="recommended"
          class="ri-heart-fill leading-4 text-slate-400"
        ></div>
      </div>

      <ClientOnly>
        <BasePopover
          :options="{
            placement: 'top-end',
            theme: 'base',
          }"
        >
          <button
            v-if="user && user.id === data.profiles.id"
            class="ri-more-line btn-base"
          ></button>

          <template #content>
            <div class="flex gap-1">
              <button
                v-if="data.profiles.role === 'admin'"
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

              <button class="ri-edit-line btn-base" @click="editPost"></button>

              <BasePopover
                :options="{
                  placement: 'left',
                  theme: 'base',
                  offset: [0, 0],
                }"
              >
                <button
                  class="ri-delete-bin-7-line btn-base text-red-500"
                ></button>

                <template #content>
                  <div class="flex items-center gap-1">
                    <div class="ml-2 whitespace-nowrap text-sm text-gray-700">
                      确认删除
                    </div>
                    <button
                      class="btn-base"
                      :class="
                        deleting
                          ? 'ri-loader-4-line animate-spin'
                          : 'ri-check-line'
                      "
                      @click="deletePost"
                    ></button>
                  </div>
                </template>
              </BasePopover>
            </div>
          </template>
        </BasePopover>
      </ClientOnly>
    </div>

    <div v-if="tags?.length" class="mt-3 flex items-center gap-2">
      <div class="tag" v-for="tag in tags">{{ tag.name }}</div>
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
import { hideAll } from 'tippy.js'

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
const deleting = ref(false)

const deletePost = throttle(async () => {
  deleting.value = true

  try {
    const { error } = await client
      .from('posts')
      .delete()
      .eq('id', props.data.id)

    if (error) throw error

    deleting.value = false

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
  store.isBoardShow = true
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
</script>

<style>
.btn-base {
  @apply h-8 w-8 rounded active:bg-gray-100;
}
</style>
