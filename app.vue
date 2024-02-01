<template>
  <NuxtLayout>
    <NuxtPage />
  </NuxtLayout>

  <BaseToast />
</template>

<style>
.page-enter-active,
.page-leave-active {
  transition: all 0.3s;
}
.page-enter-from,
.page-leave-to {
  transform: translateY(10px);
  opacity: 0;
}
</style>
