export const useOverlay = defineStore('Overlay', () => {
  const show = ref(false)

  const component = shallowRef(null)

  const options = ref(null)

  const data = ref(null)

  return {
    show,
    component,
    options,
    data,
  }
})
