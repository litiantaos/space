export const useToast = defineStore('Toast', () => {
  interface options {
    type: string
  }

  const show = ref(false)
  const options = ref({})

  const loading = ref(false)

  const push = (e: options) => {
    if (show.value) {
      show.value = false

      setTimeout(() => {
        show.value = true
      }, 400)
    } else {
      show.value = true
    }

    if (e) {
      options.value = e
    }

    if (!loading.value) {
      setTimeout(() => {
        show.value = false
      }, 3000)
    }
  }

  return { show, options, loading, push }
})
