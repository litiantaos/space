<template>
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
</template>

<script setup>
const props = defineProps({
  data: Object,
  type: {
    type: String,
    default: 'min',
  },
  hideCitedPost: {
    type: Boolean,
    default: false,
  },
})

const emit = defineEmits(['title'])

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
      // title.value = match[1]
      content.value = htmlString.replace(regex, '')
      emit('title', match[1])
    }
  } else {
    content.value = props.data.content
  }
}

const toPost = () => {
  if (props.type !== 'min') return

  localStorage.setItem('post', JSON.stringify(props.data))
  navigateTo('/post/' + props.data.id)
}
</script>
