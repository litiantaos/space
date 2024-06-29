<template>
  <Transition name="toast-up">
    <div
      v-if="toast.show"
      class="c-bg-page c-border-el c-text-base fixed bottom-10 left-[50%] z-50 flex h-10 min-w-16 -translate-x-2/4 select-none items-center justify-center gap-3 rounded-full px-2"
    >
      <div
        v-if="toast.options?.type"
        class="ml-1 text-xl"
        :class="iconMap[toast.options.type]"
      ></div>

      <div
        class="text-sm"
        :class="[
          { 'ml-4': !toast.options?.type },
          { 'mr-4': !toast.options?.action },
        ]"
      >
        {{ toast.options?.text || 'Success' }}
      </div>

      <button
        v-if="toast.options?.action"
        class="c-bg-el-2 c-bg-el-active flex h-6 w-6 items-center justify-center rounded-full"
        @click="toast.options?.action"
      >
        <div
          class="text-sm"
          :class="
            toast.loading ? 'ri-loader-4-line animate-spin' : 'ri-check-line'
          "
        ></div>
      </button>
    </div>
  </Transition>
</template>

<script setup>
import { useToast } from '~/stores/toast'

const toast = useToast()

const iconMap = {
  info: 'ri-information-fill',
  success: 'ri-checkbox-circle-fill text-green-300',
}
</script>

<style>
.toast-up-enter-active,
.toast-up-leave-active {
  transition:
    transform 0.4s,
    opacity 0.4s;
}

.toast-up-enter-from,
.toast-up-leave-to {
  transform: translate(-50%, 100px) scale(0.8);
  opacity: 0;
}
</style>
