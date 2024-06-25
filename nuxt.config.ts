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
    pageTransition: { name: 'move-up', mode: 'out-in' },
  },
  css: ['remixicon/fonts/remixicon.css', '~/assets/css/main.css'],
  runtimeConfig: {
    public: {
      siteUrl: '',
      supabaseUrl: process.env.SUPABASE_URL,
    },
    geminiAK: '',
    amapAK: '',
    amapSK: '',
  },
  modules: [
    '@nuxtjs/tailwindcss',
    '@pinia/nuxt',
    '@nuxtjs/supabase',
    '@nuxtjs/sitemap',
    'nuxt-simple-robots',
  ],
  pinia: {
    storesDirs: ['./stores/**'],
  },
  supabase: {
    redirect: false,
  },
  sitemap: {
    sources: ['/api/sitemap/urls'],
    autoLastmod: true,
  },
  robots: {
    disallow: ['/login', '/profile', '/search', '/tag'],
    sitemap: ['/sitemap.xml'],
    credits: false,
  },
})
