<template>
  <button
    @click="chooseFile"
    class="relative h-20 w-20 overflow-hidden rounded-md border"
  >
    <img
      :src="src || 'https://api.dicebear.com/7.x/thumbs/svg?seed=teoSpace'"
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
const client = useSupabaseClient()
const user = useSupabaseUser()

const props = defineProps(['src'])
const emit = defineEmits(['update:src', 'upload'])

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

    if (!files.value || files.value.length === 0) {
      throw new Error('请选择图片')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName = user.value.id + '.' + fileExt
    const filePath = 'avatars/' + fileName

    const {
      data: { path },
      error: uploadError,
    } = await client.storage.from('users').upload(filePath, file, {
      upsert: true,
    })

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = client.storage.from('users').getPublicUrl(path)

    emit('update:src', publicUrl)
    emit('upload')
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}
</script>
