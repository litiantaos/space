<template>
  <div>
    <div
      class="c-bg-page sticky left-0 right-0 top-0 z-10 mx-auto h-16 max-w-3xl px-4"
    >
      <div
        class="c-text-base absolute top-1/2 max-w-3xl -translate-y-1/2 cursor-pointer select-none text-2xl transition-[left,transform] duration-500"
        :class="isCenter ? 'left-1/2 -translate-x-1/2' : 'left-4 translate-x-0'"
        @click="goHome"
      >
        <span class="text-blue-500">TEO</span>
        <span>SPACE</span>
      </div>

      <Transition name="fade">
        <div
          v-show="!isCenter"
          class="absolute right-4 top-1/2 -translate-y-1/2"
        >
          <MainHeader is-mini />
        </div>
      </Transition>
    </div>

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

const goHome = () => {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    navigateTo('/')
  }
}

// On Page Scroll
const route = useRoute()

const isCenter = ref(true)

const currentScrollY = ref(0)
const previousScrollY = ref(0)

const handleScroll = () => {
  const routeParts = route.fullPath.split('/')

  if (routeParts[1] === '' || routeParts[1] === 'post') {
    currentScrollY.value = window.scrollY

    const scrollDistance = currentScrollY.value - previousScrollY.value

    if (Math.abs(scrollDistance) >= 400) {
      if (scrollDistance > 0) {
        isCenter.value = false
      } else {
        isCenter.value = true
      }

      previousScrollY.value = currentScrollY.value
    }
  }
}

onMounted(() => {
  window.addEventListener('scroll', handleScroll)
})

onUnmounted(() => {
  window.removeEventListener('scroll', handleScroll)
})
</script>
