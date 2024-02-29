import { hideAll } from 'tippy.js'

export const useOverlay = defineStore('Overlay', () => {
  const show = ref(false)

  const data = ref(null)

  const handleShow = () => {
    show.value = true
    hideAll()
  }

  const handleHide = () => {
    show.value = false
  }

  return {
    show,
    data,
    handleShow,
    handleHide,
  }
})
