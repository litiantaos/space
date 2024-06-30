export const usePostStore = defineStore('Post', () => {
  const client = useSupabaseClient()

  // Posts
  const posts = ref(null)
  const tempPost = ref(null)

  const pageSize = ref(10)
  const currentPage = ref(2)

  const listKey = ref(0)

  // Board
  const boardShow = ref(false)

  const postToEdit = ref(null)
  const edited = ref(false)

  const postIdToCite = ref(null)
  const cited = ref(false)

  const getPosts = async ({
    page = 1,
    ilike = '',
    inArr = [],
    cite = [],
  } = {}) => {
    const from = (page - 1) * pageSize.value

    let query = client
      .from('posts')
      .select('*, users(id, user_id, nickname, avatar_url, role)')

    if (cite.length) {
      query = query.eq(cite[0], cite[1])
    } else {
      query = query.neq('as_comment', true)
    }

    query = query.neq('is_hidden', true)

    if (ilike) {
      query = query.ilike('content', `%${ilike}%`)
    } else if (inArr.length) {
      query = query.in('id', inArr)
    }

    try {
      const { data } = await query
        .order('is_recommended', { ascending: false })
        .order('created_at', { ascending: false })
        .range(from, from + pageSize.value - 1)

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
    posts,
    tempPost,
    pageSize,
    currentPage,
    listKey,
    boardShow,
    postToEdit,
    edited,
    postIdToCite,
    cited,
    getPosts,
    getPost,
  }
})
