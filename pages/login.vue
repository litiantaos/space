<template>
  <div class="mt-10 flex w-full flex-col gap-6 sm:w-72">
    <button class="w-fit text-xl font-bold" @click="toggle">
      {{ isSignIn ? '登录' : '注册' }}
    </button>

    <BaseInput
      type="email"
      placeholder="邮箱"
      v-model="email"
      @keyup.enter="submit"
    ></BaseInput>

    <BaseInput
      type="password"
      placeholder="密码"
      v-model="password"
      :icon="email && password ? 'ri-arrow-right-circle-line' : ''"
      :loading="loading"
      @confirm="submit"
      @keyup.enter="submit"
    ></BaseInput>

    <div class="text-sm text-green-500">{{ message }}</div>
  </div>
</template>

<script setup>
import { useToast } from '~/stores/toast'

const client = useSupabaseClient()
const user = useSupabaseUser()

const isSignIn = ref(true)

const email = ref('')
const password = ref('')

const loading = ref(false)
const message = ref('')

const submit = throttle(() => {
  if (loading.value || !email.value || !password.value) return

  if (isSignIn.value) {
    signIn()
  } else {
    signUp()
  }
}, 2000)

const signIn = async () => {
  loading.value = true

  try {
    const { error } = await client.auth.signInWithPassword({
      email: email.value,
      password: password.value,
    })

    if (error) {
      useToast().push({
        type: 'info',
        text: '未注册或密码错误',
      })

      return
    }

    await getProfile(user.value.id)

    navigateTo('/')
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const signUp = async () => {
  loading.value = true

  try {
    const { error } = await client.auth.signUp({
      email: email.value,
      password: password.value,
    })

    if (error) throw error

    message.value = '请检查验证邮件并确认'
  } catch (error) {
    alert(error.message)
  } finally {
    loading.value = false
  }
}

const toggle = () => {
  isSignIn.value = !isSignIn.value
  message.value = ''
}
</script>
