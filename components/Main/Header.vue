<template>
  <div class="flex justify-center gap-2 transition-all duration-200">
    <button
      class="flex h-8 items-center gap-3 rounded-full border px-4 text-xs"
      @click="createPost"
    >
      心有从容，向阳而生
    </button>

    <MainHeaderUser />

    <button
      class="ri-donut-chart-line flex h-8 w-8 items-center justify-center rounded-full border text-xl"
      @click="showSearch"
    ></button>
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const createPost = () => {
  usePostStore().isBoardShow = true
}
</script>
