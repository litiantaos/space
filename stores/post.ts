export const usePostStore = defineStore('Post', () => {
  const isBoardShow = ref(false)

  const editablePost = ref(null)
  const localPost = ref(null)

  const citedPostId = ref(null)

  const posts = ref(null)

  const page = ref(1)
  const pageSize = ref(10)

  const getPosts = async () => {
    const from = (page.value - 1) * pageSize.value

    try {
      const { data } = await useSupabaseClient()
        .from('posts')
        .select('*, profiles(id, nickname, avatar_url, role)')
        .order('is_recommended', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, from + pageSize.value - 1)

      page.value++

      return data
    } catch (error: any) {
      alert(error.message)
    }
  }

  return { isBoardShow, editablePost, localPost, citedPostId, posts, page, pageSize, getPosts }
})
