<template>
  <div class="h-fit max-h-[calc(100vh-32px)]">
    <div class="relative mx-auto w-full overflow-hidden rounded-md sm:w-96">
      <img v-if="image && !loading" :src="image" class="w-full" />

      <div
        v-if="loading"
        ref="shotRef"
        class="mx-auto w-full overflow-hidden bg-white text-gray-500"
      >
        <div class="p-8">
          <div class="text-sm text-gray-400">
            {{ formatTime(data.created_at) }}
          </div>

          <div
            v-html="replaceVideo(data.content)"
            class="html-style mt-4"
          ></div>

          <div v-if="data.tags?.length" class="mt-4 flex items-center gap-2">
            <div class="tag bg-slate-100/85" v-for="tag in data.tags">
              {{ tag.name }}
            </div>
          </div>
        </div>

        <div class="flex items-center justify-between bg-slate-100/60 p-8">
          <div class="flex items-center gap-3">
            <img
              v-if="data.users?.avatar_url"
              :src="data.users?.avatar_url"
              class="h-6 w-6 rounded-full border"
            />
            <div class="font-bold">
              {{ data.users?.nickname || defaultNickname }}
            </div>
          </div>
          <div class="text-blue-500">
            TEO<span class="text-gray-500">SPACE</span>
          </div>
        </div>
      </div>

      <BaseLoading type="absolute" :loading="loading" />
    </div>
  </div>
</template>

<script setup>
import { toPng } from 'html-to-image'

const props = defineProps({
  data: Object,
})

const shotRef = ref(null)

const image = ref(null)

const shot = async () => {
  if (shotRef.value) {
    image.value = await toPng(shotRef.value)
  }
}

onMounted(() => {
  shot()

  setTimeout(() => {
    loading.value = false
  }, 1000)
})

const loading = ref(true)

// Replace Video
const replaceVideo = (html) => {
  return html.replace(
    /<video.*?video>/g,
    '<div class="w-full h-40 rounded-md bg-slate-100 ri-play-circle-fill text-slate-300 text-3xl flex justify-center items-center"></div>',
  )
}
</script>
