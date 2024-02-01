<template>
  <NodeViewWrapper>
    <div v-if="!attrs.src" class="my-2 flex w-full gap-2">
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

      <button
        @click="chooseFile"
        class="flex h-10 w-10 items-center justify-center rounded-md border text-xl"
      >
        <div
          :class="
            uploading ? 'ri-loader-4-line animate-spin' : 'ri-upload-cloud-line'
          "
        ></div>
        <input
          ref="fileInput"
          type="file"
          :accept="isImg ? 'image/*' : 'video/*'"
          hidden
          @change="uploadFile"
        />
      </button>
    </div>

    <div
      v-else
      draggable="true"
      data-drag-handle
      :style="`width: ${attrs.width}; ${attrs.style}`"
      class="group relative transition-[width] duration-300"
    >
      <img v-if="isImg" :src="attrs.src" alt="image" class="w-full" />

      <video v-else :src="attrs.src" class="w-full" controls></video>

      <div
        class="absolute right-2 top-2 flex overflow-hidden rounded border bg-white opacity-0 transition-opacity group-hover:opacity-90"
      >
        <button
          class="ri-checkbox-blank-line h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ width: '30%' })"
        ></button>
        <button
          class="ri-checkbox-indeterminate-line h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ width: '60%' })"
        ></button>
        <button
          class="ri-add-box-line h-8 w-8 active:bg-slate-100"
          @click="() => updateAttributes({ width: '100%' })"
        ></button>
      </div>
    </div>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'

const props = defineProps({
  nodeViewProps,
})

const attrs = ref(props.node.attrs)
const isImg = computed(() => attrs.value.type === 'img')

watch(
  () => props.node.attrs,
  (value) => {
    attrs.value = value
  },
)

const inputValue = ref('')

const submit = () => {
  if (!inputValue.value) return

  props.updateAttributes({
    src: inputValue.value,
  })
}

const fileInput = ref()
const files = ref(null)
const uploading = ref(false)

const chooseFile = () => {
  if (uploading.value) return

  fileInput.value.click()
}

const client = useSupabaseClient()

const uploadFile = async (e) => {
  files.value = e.target.files

  try {
    uploading.value = true

    if (!files.value || files.value.length === 0) {
      throw new Error('请选择文件')
    }

    const file = files.value[0]
    const fileExt = file.name.split('.').pop().toLowerCase()
    const fileName =
      file.name.split('.').shift() + '_' + Date.now() + '.' + fileExt
    const filePath = isImg.value ? 'images/' + fileName : 'videos/' + fileName

    const {
      data: { path },
      error: uploadError,
    } = await client.storage.from('posts').upload(filePath, file)

    if (uploadError) throw uploadError

    const {
      data: { publicUrl },
    } = client.storage.from('posts').getPublicUrl(path)

    props.updateAttributes({
      src: publicUrl,
    })
  } catch (error) {
    alert(error.message)
  } finally {
    uploading.value = false
  }
}
</script>
