import { serverSupabaseClient } from '#supabase/server'

export default defineSitemapEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { data: posts } = await client.from('posts').select('id, content')

  return posts.map((post) => {
    const imgMatches = post.content.matchAll(/<img[^>]+src="([^">]+)"/g)
    const videoMatches = post.content.matchAll(/<video[^>]+src="([^">]+)"/g)

    const images = [...imgMatches].map((match) => {
      return {
        loc: match[1],
      }
    })

    const videos = [...videoMatches].map((match) => {
      return {
        content_loc: match[1],
        title: match[1].slice(
          match[1].lastIndexOf('/') + 1,
          match[1].lastIndexOf('.'),
        ),
      }
    })

    return {
      loc: `/post/${post.id}`,
      images,
      videos,
    }
  })
})
