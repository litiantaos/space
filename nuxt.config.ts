export default defineNuxtConfig({
  app: {
    head: {
      title: 'TeoSpace',
      meta: [
        {
          name: 'description',
          content: '为自己开辟的一方灵魂角落，随性而生……',
        },
        {
          name: 'viewport',
          content: 'width=device-width, initial-scale=1, maximum-scale=1',
        },
      ],
    },
    pageTransition: { name: 'page', mode: 'out-in' },
  },
  css: ['remixicon/fonts/remixicon.css', '~/assets/css/main.css'],
  modules: ['@nuxtjs/tailwindcss', '@pinia/nuxt', '@nuxtjs/supabase', '@nuxtjs/sitemap'],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  supabase: {
    redirect: false,
  },
  sitemap: {
    sources: ['/api/sitemap/urls']
  }
})
