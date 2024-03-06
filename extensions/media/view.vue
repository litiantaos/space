<template>
  <NodeViewWrapper>
    <div v-if="!src" class="flex w-full gap-2 sm:w-96">
      <button
        @click="chooseFile"
        class="flex h-10 w-20 items-center justify-center rounded-md border bg-white text-xl text-gray-600 transition-all active:bg-slate-50"
      >
        <div
          :class="
            uploading ? 'ri-loader-4-line animate-spin' : 'ri-arrow-up-line'
          "
        ></div>
        <input
          ref="fileInputRef"
          type="file"
          :accept="isImg ? 'image/*' : 'video/*'"
          hidden
          @change="uploadFile"
        />
      </button>

      <BaseInput
        type="text"
        placeholder="URL"
        v-model="inputValue"
        icon="ri-check-line"
        auto-focus
        @confirm="submit"
        @keyup.enter="submit"
        class="flex-1"
      />
    </div>

    <div
      v-else
      draggable="true"
      data-drag-handle
      :style="{ width: attrs.width }"
      :class="{ 'mx-auto': attrs.align === 'center' }"
      class="group relative overflow-hidden rounded-md bg-slate-100 transition-[width] duration-300"
    >
      <img v-if="isImg" :src="src" alt="image" class="w-full" />

      <video v-else :src="src" class="w-full" controls></video>

      <div
        class="absolute right-2 top-2 flex overflow-hidden rounded border bg-white opacity-0 transition-opacity group-hover:opacity-90"
      >
        <button
          class="ri-layout-column-fill h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ align: 'left' })"
        ></button>
        <button
          class="ri-layout-column-line h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ align: 'center' })"
        ></button>
        <button
          class="ri-checkbox-indeterminate-line h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ width: '30%' })"
        ></button>
        <button
          class="ri-checkbox-blank-line h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ width: '60%' })"
        ></button>
        <button
          class="ri-add-box-line h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ width: '100%' })"
        ></button>
      </div>

      <Transition name="fade">
        <div
          v-if="uploading"
          class="absolute bottom-2 right-2 flex items-center gap-2 rounded bg-black/30 px-3 py-1 text-white backdrop-blur-md"
        >
          <svg width="20" height="20" xmlns="http://www.w3.org/2000/svg">
            <circle
              stroke="white"
              stroke-width="2"
              fill="none"
              cx="10"
              cy="10"
              r="9"
            />
            <circle
              class="origin-center -rotate-90 transition-[stroke-dasharray]"
              stroke="white"
              stroke-width="6"
              fill="transparent"
              cx="10"
              cy="10"
              r="3"
              :stroke-dasharray="dasharray"
            />
          </svg>
          <div class="text-base">{{ progress }} %</div>
        </div>
      </Transition>
    </div>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps({
  nodeViewProps,
})

const attrs = ref(props.node.attrs)

watch(
  () => props.node.attrs,
  (value) => {
    attrs.value = value
  },
)

const isImg = computed(() => attrs.value.type === 'img')

const src = ref(null)

if (attrs.value.src) {
  src.value = attrs.value.src
}

// Upload File
const fileInputRef = ref(null)

const uploading = ref(false)

const progress = ref(0)

const circumference = 2 * Math.PI * 3

const dasharray = computed(() => [
  (circumference / 100) * progress.value,
  circumference,
])

const chooseFile = () => {
  if (uploading.value) return

  fileInputRef.value.click()
}

const uploadFile = async (e) => {
  const files = e.target.files

  // console.log(files)

  if (!files || files.length === 0) return

  const file = files[0]

  src.value = URL.createObjectURL(file)

  uploading.value = true

  const fileExt = splitFileName(file.name)[1]
  const fileName =
    splitFileName(file.name)[0] + '_' + Date.now() + '.' + fileExt

  const path = isImg.value
    ? 'post/images/' + fileName
    : 'post/videos/' + fileName

  const url = await uploadToSupabaseWithTus(file, path)

  src.value = url

  props.updateAttributes({
    src: url,
  })

  uploading.value = false
}

// Tus
const uploadToSupabaseWithTus = async (file, path, bucket = 'space') => {
  const tus = await import('tus-js-client')

  const options = await uploadToSupabaseOptions(path)

  return new Promise(async (resolve, reject) => {
    const upload = new tus.Upload(file, {
      ...options,
      onError: (error) => {
        reject(error)
      },
      onProgress: (bytesUploaded, bytesTotal) => {
        const percentage = ((bytesUploaded / bytesTotal) * 100).toFixed(2)

        // console.log(bytesUploaded, bytesTotal, percentage + '%')

        progress.value = percentage
      },
      onSuccess: () => {
        const config = useRuntimeConfig()

        const url =
          config.public.supabaseUrl +
          '/storage/v1/object/public/' +
          bucket +
          '/' +
          path

        resolve(url)
      },
    })

    const previousUploads = await upload.findPreviousUploads()

    if (previousUploads.length) {
      upload.resumeFromPreviousUpload(previousUploads[0])
    }

    upload.start()
  })
}

// Input Url
const inputValue = ref('')

const submit = () => {
  if (!inputValue.value) return

  props.updateAttributes({
    src: inputValue.value,
  })
}
</script>
