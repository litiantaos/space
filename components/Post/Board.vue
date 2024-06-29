<template>
  <div
    v-if="store.boardShow"
    class="fixed bottom-0 left-0 right-0 top-0 z-[15]"
  >
    <Transition name="fade">
      <div
        v-if="show"
        class="absolute left-0 top-0 h-full w-full bg-black/30"
        @click="closeBoard"
      ></div>
    </Transition>

    <Transition name="move-up-vh">
      <div v-if="show" class="c-bg-page absolute left-0 top-0 h-full w-full">
        <div
          class="mx-auto flex h-full w-full max-w-3xl flex-col items-center gap-4 p-4"
        >
          <button
            class="ri-arrow-down-wide-fill text-xl text-gray-400 active:text-gray-300"
            @click="closeBoard"
          ></button>

          <BaseEditor
            v-if="showEditor"
            v-model="editorContent"
            class="w-full"
            :class="user ? 'h-[calc(100%-184px)]' : 'h-[calc(100%-120px)]'"
          />

          <div class="no-scrollbar flex items-center gap-2 overflow-x-auto">
            <div v-if="isCite" class="flex flex-none items-center gap-2">
              <button
                class="tag-base"
                :class="
                  citeAsComment
                    ? 'c-text-base c-bg-el-2'
                    : 'c-text-base c-bg-el'
                "
                @click="() => (citeAsComment = !citeAsComment)"
              >
                仅回帖
              </button>

              <div class="c-bg-el-2 mx-1 h-5 w-px"></div>
            </div>

            <button
              v-for="(tag, idx) in tags"
              class="tag-base"
              :class="
                tag.checked ? 'c-text-base c-bg-el-2' : 'c-text-base c-bg-el'
              "
              @click="checkTag(idx)"
            >
              {{ tag.name }}
            </button>
          </div>

          <button v-if="user" @click="submit" class="btn-circle mt-4">
            <div class="ri-rocket-fill" :class="{ bounce: loading }"></div>
          </button>
        </div>
      </div>
    </Transition>
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const store = usePostStore()

const client = useSupabaseClient()
const user = useSupabaseUser()

const editorContent = ref(null)
const loading = ref(false)

const show = ref(false)
const showEditor = ref(false)

// Watch
const isEdit = ref(false)
const isCite = ref(false)

watch(
  () => [
    store.boardShow,
    store.editorContent,
    store.editablePost,
    store.citedPostId,
  ],
  ([newBoardShow, newEditorContent, newEditablePost, newCitedPostId]) => {
    if (newBoardShow) {
      document.body.style.overflow = 'hidden'

      setTimeout(() => {
        show.value = true

        // Fix FloatingMenu Mispositioned When Opening Board
        setTimeout(() => {
          showEditor.value = true
        }, 100)
      }, 100)
    } else if (!newBoardShow) {
      document.body.style.overflow = ''
    }

    if (newEditorContent) {
      editorContent.value = newEditorContent
    }

    if (newEditablePost) {
      isEdit.value = true
      editorContent.value = newEditablePost.content
      matchCheckedTags()
    }

    if (newCitedPostId) {
      isCite.value = true
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
const citeAsComment = ref(false)

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
  } else if (isCite.value) {
    upsert.cited_post_id = store.citedPostId

    if (citeAsComment.value) {
      upsert.as_comment = true
    }
  }

  try {
    const { data } = await client.from('posts').upsert(upsert).select().single()

    if (checkedTags.value) {
      await upsertTags(data.id)
    }

    // Update Posts in View
    const newPost = await store.getPost(data.id)

    if (isEdit.value) {
      // Replace Old Post in Store
      if (store.posts) {
        const index = store.posts.findIndex((item) => item.id === data.id)

        if (index !== -1) {
          store.posts.splice(index, 1, newPost)
        }
      }

      // Update Post in Post Page
      store.editedPost = newPost
    } else {
      if (store.posts) {
        const index = store.posts.findIndex(
          (item) => item.is_recommended === false,
        )

        if (index !== -1) {
          store.posts.splice(index, 0, newPost)
        }
      } else {
        store.posts = [newPost]
      }
    }

    // Update Post List View
    store.listKey++

    // Close and Reset Board
    store.boardShow = false
    editorContent.value = null

    if (upsert.cited_post_id) {
      store.citedPostId = null
      store.cited = true
    }
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const closeBoard = () => {
  show.value = false
  showEditor.value = false

  setTimeout(() => {
    store.boardShow = false
    editorContent.value = null
    store.editablePost = null
    store.editorContent = null
    citeAsComment.value = false

    initTags()
  }, 500)
}
</script>

<style>
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
