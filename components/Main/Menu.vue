<template>
  <ClientOnly>
    <div
      v-if="!isMini"
      class="flex justify-center gap-2 transition-all duration-200"
    >
      <button
        class="c-border-el c-text-base c-bg-el-active c-bg-el-hover flex h-8 select-none items-center gap-3 rounded-full px-4 text-xs"
        @click="createPost"
      >
        心有从容，向阳而生
      </button>

      <button
        class="ri-donut-chart-line c-bg-el-active c-border-el c-text-base c-bg-el-hover flex h-8 w-8 items-center justify-center rounded-full text-xl"
        @click="toSearch"
      ></button>

      <div>
        <div
          v-if="user"
          class="c-border-el c-text-base c-bg-el-active c-bg-el-hover flex h-8 items-center justify-center gap-3 rounded-full px-1.5"
        >
          <button
            class="flex items-center gap-2 active:text-gray-400"
            @click="toUserPage"
          >
            <img
              :src="profile?.avatar_url || defaultAvatarUrl"
              class="c-bg-el c-border-el h-5 w-5 overflow-hidden rounded-full object-cover"
            />
            <div class="text-sm">
              {{ profile?.nickname || defaultNickname }}
            </div>
          </button>

          <button
            class="ri-arrow-right-line text-gray-500 active:text-gray-400"
            @click="logout"
          ></button>
        </div>

        <button
          v-else
          class="ri-user-smile-line c-border-el c-text-base c-bg-el-active c-bg-el-hover flex h-8 w-8 items-center justify-center rounded-full text-xl"
          @click="toLogin"
        ></button>
      </div>
    </div>

    <div v-else class="flex w-fit gap-5 text-xl">
      <button
        class="ri-add-circle-line t-active-scale c-text-base"
        @click="createPost"
      ></button>
      <button
        class="ri-donut-chart-line t-active-scale c-text-base"
        @click="toSearch"
      ></button>
      <button v-if="user" @click="toUserPage" class="t-active-scale">
        <img
          :src="profile?.avatar_url || defaultAvatarUrl"
          class="c-bg-el c-border-el h-5 w-5 overflow-hidden rounded-full object-cover"
        />
      </button>
      <button
        v-else
        class="ri-user-smile-line c-text-base t-active-scale"
        @click="toLogin"
      ></button>
    </div>
  </ClientOnly>
</template>

<script setup>
import { usePostStore } from '~/stores/post'
import { useToast } from '~/stores/toast'

const props = defineProps({
  isMini: {
    type: Boolean,
    default: false,
  },
})

const client = useSupabaseClient()
const user = useSupabaseUser()

const profile = ref(null)

onMounted(() => {
  profile.value = useUserProfile().profile.value
})

const logout = () => {
  useToast().push({
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

const createPost = () => {
  usePostStore().boardShow = true
}

const toUserPage = () => {
  navigateTo(`/user/${profile.value?.id}`)
}

const toSearch = () => {
  navigateTo('/search')
}

const toLogin = () => {
  navigateTo('/login')
}
</script>
