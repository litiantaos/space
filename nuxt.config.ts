export default defineNuxtConfig({
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/supabase'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  supabase: {
    redirectOptions: {
      login: '/login',
      callback: '/',
      exclude: [],
      cookieRedirect: false,
    },
  },
  css: ['remixicon/fonts/remixicon.css'],
})
