<template>
  <div class="h-fit max-h-[calc(100vh-32px)]">
    <div
      class="relative mx-auto w-[calc(100vw-32px)] overflow-hidden rounded-md sm:w-96"
    >
      <img v-if="image && !loading" :src="image" class="w-full" />

      <div
        v-if="loading"
        ref="shotRef"
        class="w-full overflow-hidden bg-white text-gray-500"
      >
        <div class="p-8">
          <div class="text-sm text-gray-400">
            {{ formatTime(data.created_at) }}
          </div>

          <div v-if="content" v-html="content" class="html-style mt-4"></div>

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

// Shot
const shotRef = ref(null)

const image = ref(null)

const loading = ref(true)

const shot = async () => {
  if (shotRef.value) {
    await toPng(shotRef.value)
    await toPng(shotRef.value)
    await toPng(shotRef.value)

    image.value = await toPng(shotRef.value)

    setTimeout(() => {
      loading.value = false
    }, 500)
  }
}

const watchImgsLoaded = () => {
  const images = shotRef.value.querySelectorAll('img')

  if (images.length) {
    let loadedCount = 0

    images.forEach((img) => {
      img.addEventListener('load', () => {
        loadedCount++

        if (loadedCount === images.length) {
          shot()
        }
      })

      if (img.complete && img.naturalWidth !== 0) {
        img.dispatchEvent(new Event('load'))
      }
    })
  } else {
    shot()
  }
}

// Parse
const content = ref(null)

const process = async () => {
  const newContent = replaceVideo(props.data.content)

  if (props.data.mapDiv) {
    const mapImg = await toPng(props.data.mapDiv)

    content.value = replaceMap(newContent, mapImg)
  } else {
    content.value = newContent
  }

  setTimeout(() => {
    watchImgsLoaded()
  }, 300)
}

const replaceVideo = (html) => {
  return html.replace(
    /<video.*?video>/g,
    '<div class="w-full h-40 rounded-md bg-slate-300 ri-play-circle-fill text-white text-3xl flex justify-center items-center"></div>',
  )
}

const replaceMap = (html, mapImg) => {
  const parser = new DOMParser()

  const doc = parser.parseFromString(html, 'text/html')

  const mapDivs = doc.querySelectorAll('div[location]')

  let img = document.createElement('img')

  img.src = mapImg

  mapDivs[0].parentNode.replaceChild(img, mapDivs[0])

  return doc.body.innerHTML
}

onMounted(() => {
  process()
})
</script>
