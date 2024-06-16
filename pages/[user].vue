<template>
  <div class="c-text-base flex w-full flex-col gap-10 pb-10">
    <div v-if="profile">
      <NuxtLink
        :to="user && user.id === profile.user_id ? '/profile' : ''"
        class="flex items-center gap-4"
      >
        <img
          :src="profile?.avatar_url || defaultAvatarUrl"
          class="h-10 w-10 rounded-md object-cover"
        />
        <h1>{{ profile?.nickname || defaultNickname }}</h1>
      </NuxtLink>
    </div>

    <div v-if="profile.resume_post_id" class="group relative">
      <div v-html="resume" class="html-style"></div>
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
