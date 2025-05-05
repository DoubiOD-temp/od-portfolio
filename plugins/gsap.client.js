import { gsap } from 'gsap'
import { ScrollTrigger } from 'gsap/ScrollTrigger'

gsap.registerPlugin(ScrollTrigger)

gsap.defaults({
  overwrite: 'auto',
  ease: 'power2.out'
})

gsap.ticker.lagSmoothing(0);

export default defineNuxtPlugin((nuxtApp) => {
  nuxtApp.provide('gsap', gsap)
  nuxtApp.provide('ScrollTrigger', ScrollTrigger)
})
