export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: true },
  css: [
    '~/assets/css/main.css'
  ],
  build: {
    transpile: ['gsap']
  },
  nitro: {
    compressPublicAssets: true,
    minify: true,
    publicAssets: [
      {
        dir: 'public',
        maxAge: 60 * 60 * 24 * 365 // 1 year
      }
    ],
    prerender: {
      failOnError: false,
      crawlLinks: true
    },
    routeRules: {
      '/': { prerender: true },
      '/resume': { prerender: true },
      '/projects': { prerender: true },
      '/contact': { prerender: true },
      '/_ipx/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/animations/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/images/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } },
      '/_nuxt/**': { headers: { 'cache-control': 'public, max-age=31536000, immutable' } }
    }
  },
  experimental: {
    treeshakeClientOnly: true,
    payloadExtraction: true
  },
  modules: [
    '@nuxtjs/google-fonts',
    '@nuxt/image',
    '@nuxtjs/critters'
  ],
  googleFonts: {
    families: {
      Inter: [400, 700],
      'Space Grotesk': [400, 700],
      Fraunces: {
        wght: [600, 800],
        ital: [400]
      }
    },
    display: 'swap',
    preconnect: true,
    preload: true,
    download: true,
    inject: true
  },
  image: {
    quality: 82,
    format: ['avif', 'webp'],
    densities: [1, 2],
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
      title: 'Ondrej Dobiš e-portfolio',
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/Site-icon.png' },
        { rel: 'prefetch', href: '/animations/iphone.json', as: 'fetch', type: 'application/json', crossorigin: 'anonymous' },
        { rel: 'prefetch', href: '/animations/od-portfolio.json', as: 'fetch', type: 'application/json', crossorigin: 'anonymous' }
      ],
      meta: [
        { charset: 'utf-8' },
        { name: 'viewport', content: 'width=device-width, initial-scale=1.0' },
        { name: 'description', content: 'Explore an e-portfolio built with Nuxt 3 and GSAP featuring collaborative software development projects, work experience, and skills in Python, Java, C#, JavaScript, and more.' }
      ]
    }
  }
})
