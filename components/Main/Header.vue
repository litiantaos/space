<template>
  <div
    class="c-bg-page sticky left-0 right-0 top-0 z-10 mx-auto h-16 max-w-3xl overflow-hidden"
  >
    <div
      class="px-4 transition-transform duration-[400ms]"
      :class="scroll ? 'move-up' : 'move-down'"
    >
      <div class="flex h-16 items-center justify-center">
        <MainTitle />
      </div>

      <div class="flex h-16 items-center justify-between">
        <MainMenu is-mini />
        <button
          class="c-text-base c-bg-el-active-scale text-xl"
          :class="theme === 'dark' ? 'ri-contrast-2-line' : 'ri-sun-line'"
          @click="toggleTheme"
        ></button>
      </div>
    </div>
  </div>
</template>

<script setup>
const props = defineProps(['scroll'])

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
})
</script>

<style>
.move-up {
  animation: move-up 0.4s forwards;

  @keyframes move-up {
    0% {
      transform: translateY(0);
      opacity: 1;
    }

    45% {
      transform: translateY(-10%);
      opacity: 0;
    }

    55% {
      transform: translateY(-40%);
      opacity: 0;
    }

    100% {
      transform: translateY(-50%);
      opacity: 1;
    }
  }
}

.move-down {
  animation: move-down 0.4s forwards;

  @keyframes move-down {
    0% {
      transform: translateY(-50%);
      opacity: 1;
    }

    45% {
      transform: translateY(-40%);
      opacity: 0;
    }

    55% {
      transform: translateY(-10%);
      opacity: 0;
    }

    100% {
      transform: translateY(0);
      opacity: 1;
    }
  }
}
</style>
