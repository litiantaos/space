<template>
  <div>
    <div
      class="c-bg-page sticky left-0 right-0 top-0 z-10 mx-auto flex h-16 max-w-3xl items-center justify-end px-4"
    >
      <div
        class="c-text-base absolute top-1/2 max-w-3xl -translate-y-1/2 cursor-pointer select-none transition-all duration-500"
        :class="
          isCenter
            ? 'left-1/2 -translate-x-1/2 text-2xl'
            : 'left-4 translate-x-0 text-xl'
        "
        @click="goHome"
      >
        <span class="text-blue-500">TEO</span>
        <span>SPACE</span>
      </div>

      <Transition name="fade">
        <div v-show="!isCenter">
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
const currentScrollPosition = ref(0)
const previousScrollPosition = ref(0)
const scrollThreshold = 400

const isCenter = ref(true)

const route = useRoute()

const handleScroll = () => {
  const parts = route.fullPath.split('/')

  if (parts[1] === '' || parts[1] === 'post') {
    currentScrollPosition.value =
      window.scrollY || document.documentElement.scrollTop

    const distanceScrolled =
      currentScrollPosition.value - previousScrollPosition.value

    if (Math.abs(distanceScrolled) >= scrollThreshold) {
      if (distanceScrolled > 0) {
        isCenter.value = false
      } else {
        isCenter.value = true
      }

      previousScrollPosition.value = currentScrollPosition.value
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
