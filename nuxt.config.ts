// https://nuxt.com/docs/api/configuration/nuxt-config
export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css',
    '~/assets/css/timeline.css'
  ],
  build: {
    transpile: ['gsap']
  },
  modules: [
    'nuxt-particles',
    '@nuxtjs/google-fonts',
    '@nuxt/image'
  ],
  particles: {
    lazy: true, // Lazy-load tsParticles for better performance
    mode: 'slim' // Use slim bundle for reduced size, sufficient for most use cases
  },
  googleFonts: {
    families: {
      Inter: [400, 700],
    },
    display: 'swap', // Use swap to prevent text from being invisible
    prefetch: true,
    preconnect: true
  },
  image: {
    quality: 80,
    format: ['webp', 'jpg'],
    screens: {
      xs: 320,
      sm: 640,
      md: 768,
      lg: 1024,
      xl: 1280,
      xxl: 1536
    },
    domains: [],
    dir: 'public',
    provider: 'ipx'
  },
  app: {
    head: {
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/Site-icon.png' },
        { rel: 'preconnect', href: 'https://fonts.googleapis.com' },
        { rel: 'preconnect', href: 'https://fonts.gstatic.com', crossorigin: '' }
      ],
      meta: [
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0, maximum-scale=1.0, user-scalable=no' }
      ]
    }
  }
})