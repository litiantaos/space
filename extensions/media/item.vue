<template>
  <div class="relative">
    <img v-if="type === 'img'" class="w-full" :src="src" />

    <video v-else :src="src" class="w-full" controls></video>

    <Transition name="fade">
      <div
        v-if="uploading"
        class="absolute left-2/4 top-2/4 flex -translate-x-2/4 -translate-y-2/4 items-center gap-2 rounded bg-black/30 px-3 py-1 text-white backdrop-blur-md"
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
</template>

<script setup>
const props = defineProps({
  type: {
    type: String,
    default: 'img',
  },
  file: null,
})

const emit = defineEmits(['upload'])

onMounted(() => {
  if (typeof props.file === 'string') {
    src.value = props.file
  } else {
    src.value = URL.createObjectURL(props.file)

    uploading.value = true

    uploadFile()
  }
})

const src = ref(null)

const uploading = ref(false)

const progress = ref(0)

const circumference = 2 * Math.PI * 3

const dasharray = computed(() => [
  (circumference / 100) * progress.value,
  circumference,
])

const uploadFile = async () => {
  const fileExt = splitFileName(props.file.name)[1]
  const fileName =
    splitFileName(props.file.name)[0] + '_' + Date.now() + '.' + fileExt

  const path =
    props.type === 'img' ? 'post/images/' + fileName : 'post/videos/' + fileName

  const url = await uploadToSupabaseWithTus(props.file, path)

  emit('upload', url)

  uploading.value = false
}

// Tus
const uploadToSupabaseWithTus = async (file, path, bucket = 'main') => {
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
</script>
