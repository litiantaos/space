<template>
  <div>
    <div ref="popover">
      <slot />
    </div>

    <div ref="content" :class="theme ? 'popover-base' : ''">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup>
import tippy from 'tippy.js'

const props = defineProps({
  options: Object,
  theme: Boolean,
})

const popover = ref(null)
const content = ref(null)

const instance = ref(null)

const init = () => {
  destroy()

  instance.value = tippy(popover.value, {
    content: content.value,
    allowHTML: true,
    ...props.options,
  })
}

const destroy = () => {
  if (instance.value) {
    instance.value.destroy()
  }
}

onMounted(init)
onUnmounted(destroy)

tippy.setDefaultProps({
  animation: 'shift-away',
  interactive: true,
  trigger: 'click',
})
</script>
