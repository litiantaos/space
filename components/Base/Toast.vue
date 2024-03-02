<template>
  <Transition name="toast-up">
    <div
      v-if="toast.show"
      class="fixed bottom-10 left-[50%] z-50 flex h-9 min-w-16 -translate-x-2/4 items-center justify-center gap-3 rounded-full bg-slate-500 px-3"
    >
      <div
        v-if="toast.options?.type"
        class="text-xl"
        :class="iconMap[toast.options.type]"
      ></div>

      <div class="text-sm text-slate-100">
        {{ toast.options?.text || 'Success' }}
      </div>

      <button
        v-if="toast.options?.type === 'action'"
        class="text-xl text-gray-200 active:text-gray-300"
        :class="
          toast.loading
            ? 'ri-loader-4-line animate-spin'
            : 'ri-checkbox-circle-fill'
        "
        @click="toast.options?.action"
      ></button>
    </div>
  </Transition>
</template>

<script setup>
import { useToast } from '~/stores/toast'

const toast = useToast()

const iconMap = {
  info: 'ri-information-fill text-slate-200',
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
