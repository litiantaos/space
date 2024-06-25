<template>
  <div
    class="c-bg-page c-text-base c-text-base flex h-10 items-center overflow-hidden rounded-md transition-[border]"
    :class="isFocus ? 'c-border-el-3' : 'c-border-el'"
  >
    <input
      ref="inputRef"
      class="h-full flex-1 px-3"
      v-model="model"
      :type="type"
      :placeholder="placeholder"
      @focus="onFocus"
      @blur="onBlur"
    />

    <div
      v-if="icon"
      class="flex h-full w-10 items-center justify-center text-xl"
    >
      <button
        :class="
          loading
            ? 'ri-loader-4-line animate-spin'
            : `${icon} transition-all active:text-gray-400`
        "
        @click="$emit('confirm')"
      ></button>
    </div>
  </div>
</template>

<script setup>
const props = defineProps({
  type: String,
  placeholder: String,
  loading: Boolean,
  icon: String,
  autoFocus: Boolean,
  custom: String,
})

const model = defineModel()

const emit = defineEmits(['confirm'])

const inputRef = ref()

onMounted(() => {
  if (props.autoFocus) {
    inputRef.value.focus()
  }
})

// Date
watch(
  () => model.value,
  (newVal) => {
    if (props.custom === 'date' && newVal) {
      // Keep Number
      let value = newVal.replace(/\D/g, '').slice(0, 8)

      // Insert '-'
      if (value.length > 4 && value.length <= 6) {
        value = value.slice(0, 4) + '-' + value.slice(4)
      } else if (value.length > 6) {
        value =
          value.slice(0, 4) + '-' + value.slice(4, 6) + '-' + value.slice(6)
      }

      model.value = value
    }
  },
)

// Focus
const isFocus = ref(false)

const onFocus = () => {
  isFocus.value = true
}

const onBlur = () => {
  isFocus.value = false
}
</script>
