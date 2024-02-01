<template>
  <Transition name="move-up">
    <div
      v-if="store.isBoardShow"
      class="fixed bottom-0 left-0 right-0 z-50 h-[calc(100vh-64px)] bg-white"
    >
      <div
        class="mx-auto flex h-full max-w-3xl flex-col items-center gap-4 p-4"
      >
        <button
          class="ri-arrow-down-wide-fill text-xl text-gray-400"
          @click="closeBoard"
        ></button>

        <BaseEditor
          v-model="editorContent"
          class="h-[calc(100%-128px)] w-full"
        />

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

const submit = throttle(async () => {
  // console.log(editorContent.value)

  if (!editorContent.value || editorContent.value === '<p></p>') return

  loading.value = true

  await upsertPost()
}, 2000)

const upsertPost = async () => {
  let upsert = {
    content: editorContent.value,
  }

  if (isEdit.value) {
    upsert.id = store.post.id
  } else if (store.citedPostId) {
    upsert.cited_post_id = store.citedPostId
  }

  try {
    const { data } = await client.from('posts').upsert(upsert).select()

    // console.log(data)

    store.isBoardShow = false

    editorContent.value = null

    store.citedPostId = null
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const closeBoard = () => {
  store.isBoardShow = false
  editorContent.value = null
  store.post = null
}

// Watch Edit
const isEdit = ref(false)

watch(
  () => store.post,
  (value) => {
    if (value) {
      editorContent.value = value.content
      isEdit.value = true
    }
  },
)
</script>

<style>
.move-up-enter-active,
.move-up-leave-active {
  transition:
    transform 0.4s,
    opacity 0.4s;
}

.move-up-enter-from,
.move-up-leave-to {
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
