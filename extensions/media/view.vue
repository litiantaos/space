<template>
  <NodeViewWrapper class="w-full flex-none" draggable="true" data-drag-handle>
    <div v-if="!files || !files.length" class="flex w-full gap-2 sm:w-96">
      <button
        @click="chooseFile"
        class="ri-arrow-up-line c-text-base c-border-el c-bg-page c-bg-el-active flex h-10 w-20 items-center justify-center rounded-md text-xl"
      >
        <input
          ref="fileInputRef"
          type="file"
          :accept="isImg ? 'image/*' : 'video/*'"
          :multiple="isImg ? true : false"
          hidden
          @change="getFile"
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
      v-else-if="files.length === 1"
      :style="{ width: attrs.width }"
      :class="{ 'mx-auto': attrs.align === 'center' }"
      class="c-bg-el group relative overflow-hidden rounded-md transition-[width] duration-300"
    >
      <MediaItem
        class="w-full"
        :file="files[0]"
        :type="isImg ? 'img' : 'video'"
        @upload="onUploaded"
      />

      <div
        class="c-bg-el absolute right-2 top-2 flex overflow-hidden rounded border opacity-0 transition-opacity group-hover:opacity-90"
      >
        <button
          class="ri-layout-column-fill c-bg-el-active-2 h-8 w-8"
          @click="() => updateAttributes({ align: 'left' })"
        ></button>
        <button
          class="ri-layout-column-line c-bg-el-active-2 h-8 w-8"
          @click="() => updateAttributes({ align: 'center' })"
        ></button>
        <button
          class="ri-checkbox-indeterminate-line c-bg-el-active-2 h-8 w-8"
          @click="() => updateAttributes({ width: '30%' })"
        ></button>
        <button
          class="ri-checkbox-blank-line c-bg-el-active-2 h-8 w-8"
          @click="() => updateAttributes({ width: '60%' })"
        ></button>
        <button
          class="ri-add-box-line c-bg-el-active-2 h-8 w-8"
          @click="() => updateAttributes({ width: '100%' })"
        ></button>
      </div>
    </div>

    <div v-else-if="files.length > 1" type="group">
      <MediaItem v-for="file in files" :file="file" @upload="onUploaded" />
    </div>
  </NodeViewWrapper>
</template>

<script setup>
import { NodeViewWrapper, nodeViewProps } from '@tiptap/vue-3'
import MediaItem from './item.vue'

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

// Upload File
const fileInputRef = ref(null)

const files = ref(null)

const chooseFile = () => {
  fileInputRef.value.click()
}

const getFile = async (e) => {
  files.value = e.target.files
  // console.log(files)
}

// Get Uploaded Url
let srcs = []

const onUploaded = (e) => {
  srcs.push(e)

  // console.log(srcs)

  props.updateAttributes({
    srcs,
  })
}

if (attrs.value.srcs) {
  files.value = attrs.value.srcs
}

// Input Url
const inputValue = ref('')

const submit = () => {
  if (!inputValue.value) return

  files.value = [inputValue.value]

  props.updateAttributes({
    srcs: [inputValue.value],
  })
}
</script>
