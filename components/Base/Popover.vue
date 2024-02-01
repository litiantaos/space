<template>
  <div>
    <div ref="popover">
      <slot />
    </div>

    <div ref="content">
      <slot name="content" />
    </div>
  </div>
</template>

<script setup>
import tippy from 'tippy.js'

const props = defineProps({
  options: Object,
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
  duration: 200,
  interactive: true,
  trigger: 'click',
})
</script>
