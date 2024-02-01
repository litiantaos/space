import { serverSupabaseClient } from '#supabase/server'

export default defineEventHandler(async (event) => {
  const client = await serverSupabaseClient(event)

  const { id } = getQuery(event)

  const { data, error } = await client
    .from('posts')
    .select('*, profiles(id, nickname, avatar_url)')
    .eq('id', id)
    .single()

  if (error) throw error

  return data
})
