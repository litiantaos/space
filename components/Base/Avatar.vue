<template>
  <button
    @click="chooseFile"
    class="c-border-el relative h-20 w-20 overflow-hidden rounded-md"
  >
    <img
      :src="src || defaultAvatarUrl"
      alt="avatar"
      class="h-full w-full object-cover"
    />

    <input
      ref="fileInput"
      type="file"
      accept="image/*"
      hidden
      @change="uploadFile"
    />

    <div
      v-if="uploading"
      class="absolute bottom-0 left-0 right-0 top-0 flex items-center justify-center bg-black/50"
    >
      <div class="ri-loader-4-line animate-spin text-xl text-white"></div>
    </div>
  </button>
</template>

<script setup>
const src = defineModel('src')

const emit = defineEmits(['upload'])

const fileInput = ref()
const files = ref(null)
const uploading = ref(false)

const chooseFile = () => {
  fileInput.value.click()
}

const uploadFile = async (e) => {
  files.value = e.target.files

  try {
    uploading.value = true

    if (!files.value || files.value.length === 0) return

    const file = files.value[0]

    const { profile } = useUserProfile()

    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = profile.value.id + '_' + Date.now() + '.' + fileExt
    const path = 'user/avatars/' + fileName

    const url = await uploadToSupabase(file, path, 'main', {
      upsert: true,
    })

    src.value = url

    emit('upload')
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}
</script>
