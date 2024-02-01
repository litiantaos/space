export const useToast = defineStore('Toast', () => {
  interface options {
    duration?: number
  }

  const show = ref(false)
  const options = ref({})

  const push = (e: options) => {
    show.value = true

    if (e) {
      options.value = e
    }

    if (!e.duration || e.duration !== 0) {
      setTimeout(() => {
        show.value = false
      }, 3000)
    }
  }

  return { show, options, push }
})
