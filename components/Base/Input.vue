<template>
  <div
    class="flex h-10 items-center overflow-hidden rounded-md border bg-white"
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
        :class="loading ? 'ri-loader-4-line animate-spin' : icon"
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
})

const emit = defineEmits(['update:modelValue', 'confirm'])

const inputRef = ref()

onMounted(() => {
  if (props.autoFocus) {
    inputRef.value.focus()
  }
})
</script>
