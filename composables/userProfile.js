export const useUserProfile = () => {
  const client = useSupabaseClient()
  const user = useSupabaseUser()

  const profile = ref(null)

  const getProfileFromCloud = async (id) => {
    const { data } = await client
      .from('users')
      .select('*')
      .eq('user_id', id)
      .single()

    setProfile(data)
  }

  const getProfile = () => {
    if (user) {
      const profileString = localStorage.getItem('profile')

      profile.value = JSON.parse(profileString)
    }
  }

  const setProfile = (data) => {
    profile.value = data

    localStorage.setItem('profile', JSON.stringify(data))
  }

  if (process.client) {
    getProfile()
  }

  return { profile, setProfile, getProfileFromCloud }
}
