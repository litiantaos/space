<template>
  <div class="flex w-full flex-col gap-10 pb-10">
    <div v-if="profile">
      <div class="flex items-center gap-4">
        <img
          :src="profile?.avatar_url || defaultAvatarUrl"
          class="h-10 w-10 rounded-md object-cover"
        />
        <h1>{{ profile?.nickname || defaultNickname }}</h1>
      </div>
    </div>

    <div v-if="profile.resume_post_id" class="group relative">
      <div v-html="resume" class="html-style"></div>
      <NuxtLink
        v-if="user && user.id === profile.user_id"
        :to="`/post/${profile.resume_post_id}`"
        class="ri-arrow-right-up-line absolute right-0 top-0 text-xl text-slate-300 opacity-0 transition-all hover:text-slate-400 group-hover:-translate-x-2 group-hover:translate-y-2 group-hover:opacity-100"
      ></NuxtLink>
    </div>

    <UserLife v-if="profile.birthday" :birthday="profile.birthday" />
  </div>
</template>

<script setup>
import { usePostStore } from '~/stores/post'

const client = useSupabaseClient()
const user = useSupabaseUser()

const id = useRoute().params.user

const { data: profile } = await client
  .from('users')
  .select()
  .eq('id', id)
  .single()

// Resume
const resume = ref(null)

if (profile.resume_post_id) {
  const { content } = await usePostStore().getPost(profile.resume_post_id)

  resume.value = content
}
</script>
