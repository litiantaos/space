<template>
  <ClientOnly>
    <div class="flex justify-center gap-2 transition-all duration-200">
      <button
        class="c-border-el c-text-base c-bg-el-active flex h-8 items-center gap-3 rounded-full px-4 text-xs"
        @click="createPost"
      >
        心有从容，向阳而生
      </button>

      <MainHeaderUser />

      <NuxtLink
        to="/search"
        class="ri-donut-chart-line c-bg-el-active c-border-el c-text-base flex h-8 w-8 items-center justify-center rounded-full text-xl"
      ></NuxtLink>
    </div>
  </ClientOnly>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const createPost = () => {
  usePostStore().boardShow = true
}
</script>
