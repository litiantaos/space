<template>
  <div
    class="cursor-pointer select-none"
    :class="[
      stroke
        ? 'text-stroke text-stroke-gray font-bold text-transparent'
        : 'c-text-base',
      size,
    ]"
    @click="goHome"
  >
    <span :class="stroke ? 'text-stroke-blue' : 'text-blue-500'">TEO</span>
    <span>SPACE</span>
  </div>
</template>

<script setup>
defineProps({
  stroke: {
    type: Boolean,
    default: false,
  },
  size: {
    type: String,
    default: 'text-2xl',
  },
})

const goHome = () => {
  if (window.scrollY > 0) {
    window.scrollTo({ top: 0, behavior: 'smooth' })
  } else {
    navigateTo('/')
  }
}
</script>

<style>
.text-stroke {
  -webkit-text-stroke-width: 1px;
}

.text-stroke-gray {
  -webkit-text-stroke-color: #aaa;
}

.text-stroke-blue {
  -webkit-text-stroke-color: rgb(59 130 246);
}
</style>
