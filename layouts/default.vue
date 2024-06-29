<template>
  <div>
    <MainHeader :scroll="scroll" />

    <div
      class="mx-auto flex max-w-3xl justify-center p-4"
      @scroll="handleScroll"
    >
      <slot />
    </div>

    <SpeedInsights />
  </div>
</template>

<script setup>
import { SpeedInsights } from '@vercel/speed-insights/vue'

// On Page Scroll
const scroll = ref(false)

const currentScrollY = ref(0)
const previousScrollY = ref(0)

const handleScroll = () => {
  currentScrollY.value = window.scrollY

  const scrollDistance = currentScrollY.value - previousScrollY.value

  if (Math.abs(scrollDistance) >= 400) {
    if (scrollDistance > 0) {
      scroll.value = true
    } else {
      scroll.value = false
    }

    previousScrollY.value = currentScrollY.value
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
