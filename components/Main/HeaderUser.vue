<template>
  <div
    v-if="user"
    class="c-border-el c-text-base c-bg-el-active flex h-8 items-center justify-center gap-3 rounded-full px-1.5"
  >
    <NuxtLink
      :to="`/${profile?.id}`"
      class="flex items-center gap-2 active:text-gray-400"
    >
      <img
        :src="profile?.avatar_url || defaultAvatarUrl"
        class="c-bg-el c-border-el h-5 w-5 overflow-hidden rounded-full object-cover"
      />
      <div class="text-sm">{{ profile?.nickname || defaultNickname }}</div>
    </NuxtLink>

    <button
      class="ri-arrow-right-line text-gray-500 active:text-gray-400"
      @click="logout"
    ></button>
  </div>

  <NuxtLink
    v-else
    to="/login"
    class="ri-user-smile-line c-border-el c-text-base c-bg-el-active flex h-8 w-8 items-center justify-center rounded-full text-xl"
  ></NuxtLink>
</template>

<script setup>
import { useToast } from '~/stores/toast'

const client = useSupabaseClient()
const user = useSupabaseUser()

const profile = ref(null)

onMounted(() => {
  profile.value = useUserProfile().profile.value
})

const logout = () => {
  useToast().push({
    type: 'action',
    text: '确定登出吗？',
    action: () => signOut(),
  })
}

const signOut = async () => {
  try {
    const { error } = await client.auth.signOut()

    if (error) throw error

    localStorage.removeItem('profile')

    useToast().show = false

    navigateTo('/')
  } catch (error) {
    alert(error.message)
  }
}
</script>
