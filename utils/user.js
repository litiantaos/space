export const getProfile = async (id) => {
  try {
    const { data } = await useSupabaseClient()
      .from('profiles')
      .select('*')
      .eq('id', id)
      .single()

    // console.log(data)

    localStorage.setItem('profile', JSON.stringify(data))

    return data
  } catch (error) {
    alert(error.message)
  }
}
