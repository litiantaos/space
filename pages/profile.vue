<template>
  <div class="mt-10 flex w-full flex-col gap-6 sm:w-72">
    <div class="text-xl font-bold">个人</div>

    <BaseAvatar v-model:src="avatar_url" @upload="update" />

    <BaseInput
      placeholder="昵称"
      v-model="nickname"
      :icon="
        nickname && loading
          ? 'ri-loader-4-line animate-spin'
          : nickname
            ? 'ri-check-line'
            : ''
      "
      @confirm="update"
    ></BaseInput>
  </div>
</template>

<script setup>
import { useToast } from '~/stores/toast'

const client = useSupabaseClient()
const user = useSupabaseUser()

const loading = ref(false)

const nickname = ref('')
const avatar_url = ref('')

const profile = ref(null)

onMounted(async () => {
  const profileString = localStorage.getItem('profile')

  if (profileString) {
    profile.value = JSON.parse(profileString)
  } else {
    profile.value = await getProfile(user.value.id)
  }

  if (profile.value) {
    nickname.value = profile.value.nickname
    avatar_url.value = profile.value.avatar_url
  }
})

loading.value = false

const update = throttle(async () => {
  try {
    loading.value = true

    const updates = {
      id: user.value.id,
      nickname: nickname.value,
      avatar_url: avatar_url.value,
      updated_at: new Date(),
    }

    const { data, error } = await client
      .from('profiles')
      .upsert(updates)
      .select()
      .single()

    // console.log(data)

    if (error) throw error

    localStorage.setItem('profile', JSON.stringify(data))

    useToast().push({
      type: 'success',
      text: '更新成功',
    })
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}, 2000)

definePageMeta({
  middleware: ['auth'],
})
</script>
