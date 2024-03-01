<template>
  <div
    class="flex h-10 items-center overflow-hidden rounded-md border bg-white text-gray-600"
  >
    <input
      class="h-full flex-1 px-2"
      :type="type"
      :placeholder="placeholder"
      :value="modelValue"
      @input="$emit('update:modelValue', $event.target.value)"
      ref="inputRef"
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
  modelValue: String,
  loading: Boolean,
  icon: String,
  autoFocus: Boolean,
  custom: String,
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const inputRef = ref()

onMounted(() => {
  if (props.autoFocus) {
    inputRef.value.focus()
  }
})

// Date
watch(
  () => props.modelValue,
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

      emit('update:modelValue', value)
    }
  },
)
</script>
