<template>
  <div class="mt-10 flex w-full flex-col gap-6 sm:w-72">
    <div class="text-xl font-bold">个人</div>

    <BaseAvatar v-model:src="avatar_url" @upload="update" />

    <BaseInput placeholder="昵称" v-model="nickname"></BaseInput>

    <BaseInput placeholder="生日" v-model="birthday" custom="date"></BaseInput>

    <BaseInput
      placeholder="简历帖文 ID"
      v-model="resume_post_id"
      type="number"
      :icon="resume_post_id ? 'ri-arrow-right-line' : ''"
      @confirm="toResumePost"
    ></BaseInput>

    <button
      class="mx-auto mt-20 h-12 w-12 rounded-full bg-slate-100 text-xl text-slate-500 transition-all active:bg-slate-300"
      :class="loading ? 'ri-loader-4-line animate-spin' : 'ri-check-line'"
      @click="update"
    ></button>
  </div>
</template>

<script setup>
import { useToast } from '~/stores/toast'

const client = useSupabaseClient()

const loading = ref(false)

const avatar_url = ref('')
const nickname = ref('')
const birthday = ref('')
const resume_post_id = ref('')

const profile = ref(null)

onMounted(() => {
  profile.value = useUserProfile().profile.value

  if (profile.value) {
    avatar_url.value = profile.value.avatar_url
    nickname.value = profile.value.nickname
    birthday.value = profile.value.birthday
    resume_post_id.value = profile.value.resume_post_id?.toString()
  }
})

loading.value = false

const update = throttle(async () => {
  try {
    loading.value = true

    const updates = {
      id: profile.value.id,
      avatar_url: avatar_url.value,
      nickname: nickname.value,
      birthday: birthday.value,
      resume_post_id: resume_post_id.value,
      updated_at: new Date(),
    }

    const { data, error } = await client
      .from('users')
      .upsert(updates)
      .select()
      .single()

    // console.log(data)

    if (error) throw error

    useUserProfile().setProfile(data)

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

const toResumePost = () => {
  const siteUrl = useRuntimeConfig().public.siteUrl

  window.open(`${siteUrl}/post/${resume_post_id.value}`, '_blank')
}

definePageMeta({
  middleware: ['auth'],
})
</script>
