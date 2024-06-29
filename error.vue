<template>
  <div
    class="c-text-base flex h-[90vh] w-screen flex-col items-center justify-center gap-4"
  >
    <MainTitle stroke size="text-5xl" />
    <h1 class="mt-10 text-2xl text-blue-500">{{ error.statusCode }}</h1>
    <p class="c-text-base-2">{{ error.message }}</p>
  </div>
</template>

<script setup>
defineProps(['error'])
</script>
