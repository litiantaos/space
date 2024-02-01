<template>
  <div
    v-if="user && profile"
    class="flex h-8 items-center justify-center gap-3 rounded-full border px-1.5"
  >
    <NuxtLink to="/profile" class="flex items-center gap-2">
      <img
        :src="profile.avatar_url || ''"
        class="h-5 w-5 overflow-hidden rounded-full border bg-slate-100 object-cover"
      />
      <div class="text-sm">{{ profile.nickname || '' }}</div>
    </NuxtLink>

    <button class="ri-arrow-right-line text-gray-500" @click="signOut"></button>
  </div>

  <NuxtLink
    v-else
    to="/login"
    class="ri-user-smile-line flex h-8 w-8 items-center justify-center rounded-full border text-xl"
  ></NuxtLink>
</template>

<script setup>
const client = useSupabaseClient()
const user = useSupabaseUser()

const profile = ref(null)

onMounted(() => {
  const profileString = localStorage.getItem('profile')

  profile.value = JSON.parse(profileString)
})

const signOut = async () => {
  try {
    const { error } = await client.auth.signOut()

    if (error) throw error

    localStorage.removeItem('profile')

    navigateTo('/')
  } catch (error) {
    alert(error.message)
  }
}
</script>
