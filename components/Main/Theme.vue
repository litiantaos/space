<template>
  <button
    class="c-text-base t-active-scale text-xl sm:hover:-rotate-45"
    :class="theme === 'dark' ? 'ri-contrast-2-line' : 'ri-sun-line'"
    @click="toggleTheme"
  ></button>
</template>

<script setup>
const theme = ref(null)

const toggleTheme = () => {
  if (theme.value === 'light') {
    theme.value = 'dark'
  } else {
    theme.value = 'light'
  }

  setTheme()
}

const setTheme = () => {
  if (theme.value === 'light') {
    localStorage.setItem('theme', 'light')
    document.documentElement.classList.remove('dark')
  } else {
    localStorage.setItem('theme', 'dark')
    document.documentElement.classList.add('dark')
  }
}

onMounted(() => {
  const localTheme = localStorage.getItem('theme')

  if (localTheme) {
    theme.value = localTheme
    setTheme()
  } else {
    theme.value = 'light'
    setTheme()
  }

  window
    .matchMedia('(prefers-color-scheme: dark)')
    .addEventListener('change', (e) => {
      if (e.matches) {
        document.documentElement.classList.add('dark')
      } else {
        document.documentElement.classList.remove('dark')
      }
    })
})
</script>
