export const usePostStore = defineStore('Post', () => {
  const client = useSupabaseClient()

  const boardShow = ref(false)

  const editablePost = ref(null)
  const localPost = ref(null)

  const citedPostId = ref(null)

  const posts = ref(null)

  const page = ref(1)
  const pageSize = ref(10)

  const listKey = ref(0)

  const editorContent = ref(null)

  const getPosts = async () => {
    const from = (page.value - 1) * pageSize.value

    try {
      const { data } = await client
        .from('posts')
        .select('*, users(id, user_id, nickname, avatar_url, role)')
        .neq('is_hidden', true)
        .order('is_recommended', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, from + pageSize.value - 1)

      page.value++

      return data
    } catch (error: any) {
      alert(error.message)
    }
  }

  const getPost = async (id: number) => {
    try {
      const { data } = await client
        .from('posts')
        .select('*, users(id, user_id, nickname, avatar_url)')
        .eq('id', id)
        .single()

      return data
    } catch (error: any) {
      alert(error.message)
    }
  }

  return {
    boardShow,
    editablePost,
    localPost,
    citedPostId,
    posts,
    page,
    pageSize,
    listKey,
    editorContent,
    getPosts,
    getPost,
  }
})
