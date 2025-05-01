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
  modules: ['nuxt-particles'],
  particles: {
    lazy: true, // Lazy-load tsParticles for better performance
    mode: 'slim' // Use slim bundle for reduced size, sufficient for most use cases
  },
  app: {
    head: {
      link: [
        { rel: 'stylesheet', href: 'https://fonts.googleapis.com/css2?family=Inter:wght@400;700&display=swap' }
      ]
    }
  }
})