export const useToast = defineStore('Toast', () => {
  interface options {
    type: string
  }

  const show = ref(false)
  const options = ref({})

  const push = (e: options) => {
    if (show.value) {
      show.value = false

      setTimeout(() => {
        show.value = true
      }, 420)
    } else {
      show.value = true
    }

    if (e) {
      options.value = e
    }
  }

  return { show, options, push }
})
