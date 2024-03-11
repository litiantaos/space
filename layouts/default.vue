<template>
  <div>
    <div class="c-bg-page sticky top-0 z-10 w-full select-none p-4">
      <div
        class="c-text-base mx-auto max-w-3xl cursor-pointer text-center text-2xl"
        @click="goHome"
      >
        <span class="text-blue-500">TEO</span>
        <span>SPACE</span>
      </div>
    </div>

    <div class="mx-auto flex max-w-3xl justify-center p-4">
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
</script>
