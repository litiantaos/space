export const usePostStore = defineStore('Post', () => {
  const isBoardShow = ref(false)

  const post = ref(null)
  const citedPostId = ref(null)

  return { isBoardShow, post, citedPostId }
})
