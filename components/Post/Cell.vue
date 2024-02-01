<template>
  <div class="flex flex-col gap-2">
    <PostCellHeader :data="data" />
    <PostCellContent :data="data" :hideCitedPost="hideCitedPost" />
  </div>
</template>

<script setup>
const props = defineProps({
  data: Object,
  hideCitedPost: Boolean,
})
</script>
