import { readFileSync } from 'node:fs';

const isProduction = process.env.NODE_ENV === 'production';

const securityHeaders = {
  'x-content-type-options': 'nosniff',
  'referrer-policy': 'strict-origin-when-cross-origin',
  'permissions-policy': 'accelerometer=(), camera=(), geolocation=(), gyroscope=(), magnetometer=(), microphone=(), payment=(), usb=(), browsing-topics=()',
  'content-security-policy': [
    "default-src 'self'",
    "base-uri 'self'",
    "object-src 'none'",
    "frame-ancestors 'self'",
    "form-action 'self'",
    "img-src 'self' data: blob:",
    "font-src 'self' data:",
    "media-src 'self' blob:",
    "style-src 'self' 'unsafe-inline'",
    "script-src 'self' 'unsafe-inline'",
    "connect-src 'self' https://app.lecture-guru.com",
    "frame-src 'self'",
    "worker-src 'self' blob:"
  ].join('; '),
  ...(isProduction ? { 'strict-transport-security': 'max-age=31536000; includeSubDomains; preload' } : {})
};

const immutableHeaders = {
  ...securityHeaders,
  'cache-control': 'public, max-age=31536000, immutable'
};

const criticalNavStyles = readFileSync(
  new URL('./assets/css/site-nav-critical.css', import.meta.url),
  'utf-8'
);

export default defineNuxtConfig({
  compatibilityDate: '2024-11-01',
  devtools: { enabled: !isProduction },
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
      '/**': { headers: securityHeaders },
      '/': { prerender: true, headers: securityHeaders },
      '/resume': { prerender: true, headers: securityHeaders },
      '/projects': { prerender: true, headers: securityHeaders },
      '/contact': { prerender: true, headers: securityHeaders },
      '/home/**': { headers: immutableHeaders },
      '/_ipx/**': { headers: immutableHeaders },
      '/animations/**': { headers: immutableHeaders },
      '/images/**': { headers: immutableHeaders },
      '/_nuxt/**': { headers: immutableHeaders }
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
  critters: {
    config: {
      preload: 'media',
      reduceInlineStyles: false
    }
  },
  googleFonts: {
    families: {
      Sora: [300, 400, 500, 600, 700, 800]
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
      style: [
        { children: criticalNavStyles }
      ],
      link: [
        { rel: 'icon', type: 'image/png', href: '/images/Site-icon.png' },
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
