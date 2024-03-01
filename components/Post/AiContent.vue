<template>
  <div
    class="relative flex min-h-60 w-full flex-col gap-6 overflow-hidden rounded-md bg-white p-6 text-slate-600 sm:w-[540px]"
    :class="{ 'justify-between': data?.result }"
  >
    <h1 class="text-xl">
      {{ data.model.toUpperCase() }}
    </h1>

    <BaseInput
      v-if="isAsk"
      v-model="input"
      placeholder="问一问"
      auto-focus
      icon="ri-close-line"
      @keyup.enter="generate"
      @confirm="() => (input = '')"
    />

    <div
      v-if="htmlContent"
      v-html="htmlContent"
      class="no-scrollbar max-h-[540px] overflow-auto text-justify text-sm leading-7 text-gray-500"
    ></div>

    <div v-if="data?.result" class="flex items-center gap-6">
      <button
        class="ri-refresh-line hover:text-blue-500"
        @click="generate"
      ></button>
      <button
        class="hover:text-blue-500"
        :class="copied ? 'ri-check-line' : 'ri-clipboard-line'"
        @click="copy"
      ></button>
      <button
        class="ri-ai-generate hover:text-blue-500"
        @click="apply"
      ></button>
    </div>

    <BaseLoading type="absolute" :loading="loading" />
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'
import { useOverlay } from '~/stores/overlay'
import { marked } from 'marked'

const data = defineModel('data')

const htmlContent = ref(null)

// Loading
const loading = ref(true)

watch(
  () => data.value.result,
  (newVal) => {
    if (newVal) {
      htmlContent.value = marked(newVal)
      loading.value = false
    }
  },
)

// Ask
const isAsk = ref(false)

if (data.value.mode && data.value.mode === 'ask') {
  isAsk.value = true
  loading.value = false
}

const input = ref('')

// Generate
const generate = async () => {
  loading.value = true

  let query = {}

  if (isAsk.value) {
    query.mode = 'ask'
    query.content = input.value
  } else {
    query.content = data.value.content
    query.type = data.value.type
  }

  const res = await $fetch(`/api/ai/${data.value.model}`, {
    query,
    timeout: 50000,
  })

  data.value.result = res

  loading.value = false
}

// Copy
const copied = ref(false)

const copy = async () => {
  copied.value = true

  await navigator.clipboard.writeText(data.value.result)

  setTimeout(() => {
    copied.value = false
  }, 2000)
}

// Apply
const apply = () => {
  const regex = new RegExp(data.value.content, 'g')

  usePostStore().editorContent = data.value.editorContent.replace(
    regex,
    data.value.result,
  )

  useOverlay().show = false
}
</script>
