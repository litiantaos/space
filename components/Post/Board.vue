<template>
  <Transition name="board-up">
    <div
      v-if="store.boardShow"
      class="fixed bottom-0 left-0 right-0 z-20 h-[calc(100vh-64px)] bg-white"
    >
      <div
        class="mx-auto flex h-full max-w-3xl flex-col items-center gap-4 p-4"
      >
        <button
          class="ri-arrow-down-wide-fill text-xl text-gray-400 active:text-gray-300"
          @click="closeBoard"
        ></button>

        <BaseEditor
          v-model="editorContent"
          class="h-[calc(100%-200px)] w-full"
        />

        <Transition name="fade">
          <div
            v-if="tags"
            class="no-scrollbar my-3 flex items-center gap-2 overflow-x-auto"
          >
            <button
              v-for="(tag, idx) in tags"
              class="tag"
              :class="
                tag.checked
                  ? 'bg-slate-400 text-white'
                  : 'bg-slate-100 text-gray-500'
              "
              @click="checkTag(idx)"
            >
              {{ tag.name }}
            </button>
          </div>
        </Transition>

        <button
          v-if="user"
          @click="submit"
          class="h-12 w-12 overflow-hidden rounded-full bg-slate-200 text-xl text-slate-500 transition-all duration-300 hover:scale-110 hover:bg-slate-500 hover:text-slate-200"
        >
          <div class="ri-rocket-fill" :class="{ bounce: loading }"></div>
        </button>
      </div>
    </div>
  </Transition>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const store = usePostStore()

const client = useSupabaseClient()
const user = useSupabaseUser()

const editorContent = ref(null)
const loading = ref(false)

const emit = defineEmits(['cited', 'edited'])

// Watch Edit
const isEdit = ref(false)

watch(
  () => [store.editablePost, store.editorContent],
  ([newVal1, newVal2]) => {
    if (newVal1) {
      editorContent.value = newVal1.content
      isEdit.value = true
      matchCheckedTags()
    }

    if (newVal2) {
      editorContent.value = newVal2
    }
  },
)

// Get All Tags
const tags = ref(null)

const { data: tagsRes } = await client.from('tags').select('id, name')

const initTags = () => {
  tags.value = tagsRes.map((item) => ({
    ...item,
    checked: false,
  }))
}

initTags()

// Check Tag
const checkedTags = ref(null)

const checkTag = (index) => {
  tags.value[index].checked = !tags.value[index].checked

  checkedTags.value = tags.value.filter((tag) => tag.checked)
}

const upsertTags = async (id) => {
  let upsert

  upsert = checkedTags.value.map((tag) => {
    return {
      post_id: id,
      tag_id: tag.id,
    }
  })

  // console.log(upsert)

  const { data } = await client.from('posts_tags').upsert(upsert).select()
}

// Edit Post: Match Checked Tags
const matchCheckedTags = () => {
  const postTags = store.editablePost.tags

  if (postTags?.length) {
    checkedTags.value = postTags

    tags.value = tags.value.map((tag) => ({
      id: tag.id,
      name: tag.name,
      checked: postTags.some((postTag) => postTag.id === tag.id),
    }))
  }
}

// Profile
const profile = ref(null)

onMounted(() => {
  profile.value = useUserProfile().profile.value
})

// Submit
const submit = throttle(async () => {
  // console.log(editorContent.value)
  // return

  if (!editorContent.value || editorContent.value === '<p></p>') return

  loading.value = true

  await upsertPost()
}, 2000)

const upsertPost = async () => {
  let upsert = {
    content: editorContent.value,
    user_id: profile.value.id,
  }

  if (isEdit.value) {
    upsert.id = store.editablePost.id

    // Delete All Tags
    const { error } = await client
      .from('posts_tags')
      .delete()
      .eq('post_id', store.editablePost.id)
  } else if (store.citedPostId) {
    upsert.cited_post_id = store.citedPostId
  }

  try {
    const { data } = await client.from('posts').upsert(upsert).select().single()

    if (checkedTags.value) {
      await upsertTags(data.id)
    }

    // Add Post to Store
    const newPost = await store.getPost(data.id)

    if (store.posts) {
      if (isEdit.value) {
        const index = store.posts.findIndex((item) => item.id === data.id)

        if (index !== -1) {
          store.posts.splice(index, 1, newPost)
        }
      } else {
        const index = store.posts.findIndex(
          (item) => item.is_recommended === false,
        )

        if (index !== -1) {
          store.posts.splice(index, 0, newPost)
        }
      }

      // Update Post List View
      store.listKey++
    } else {
      emit('edited', newPost)
    }

    // Close and Reset Board
    store.boardShow = false
    editorContent.value = null

    if (upsert.cited_post_id) {
      store.citedPostId = null
      emit('cited')
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const closeBoard = () => {
  store.boardShow = false
  editorContent.value = null
  store.editablePost = null
  store.editorContent = null

  initTags()
}
</script>

<style>
.board-up-enter-active,
.board-up-leave-active {
  transition:
    transform 0.4s,
    opacity 0.4s;
}

.board-up-enter-from,
.board-up-leave-to {
  transform: translateY(50vh);
  opacity: 0;
}

.bounce {
  animation: bounce 0.8s infinite;

  @keyframes bounce {
    0% {
      transform: translateY(180%);
    }

    100% {
      transform: translateY(-180%);
    }
  }
}
</style>
