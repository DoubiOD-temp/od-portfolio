<template>
  <div>
    <h1>My Projects</h1>
    <div class="projects-grid">
      <Card v-for="project in projects" :key="project.slug" :project="project" :images="project.images" />
    </div>
  </div>
</template>

<script setup>
import { onMounted, nextTick } from 'vue';
import Card from '~/components/Card.vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const projects = [
  {
    slug: 'wedolaundry',
    name: 'WeDoLaundry',
    description: 'Description for WeDoLaundry',
    images: [
      { url: '/images/img.png', alt: 'WeDoLaundry Image 1' },
      { url: '/images/img.png', alt: 'WeDoLaundry Image 2' },
      { url: '/images/img.png', alt: 'WeDoLaundry Image 3' },
    ],
  },
  {
    slug: 'weather-vessel',
    name: 'Weather & Vessel prediction software',
    description: 'Description for Weather & Vessel prediction software',
    images: [
      { url: '/images/img.png', alt: 'Weather & Vessel Image 1' },
      { url: '/images/img.png', alt: 'Weather & Vessel Image 2' },
      { url: '/images/img.png', alt: 'Weather & Vessel Image 3' },
    ],
  },
  {
    slug: 'bidhub',
    name: 'BidHub',
    description: 'Description for BidHub',
    images: [
      { url: '/images/img.png', alt: 'BidHub Image 1' },
      { url: '/images/img.png', alt: 'BidHub Image 2' },
      { url: '/images/img.png', alt: 'BidHub Image 3' },
    ],
  },
  {
    slug: 'music-downloader',
    name: 'Music downloader',
    description: 'Description for Music downloader',
    images: [
      { url: '/images/img.png', alt: 'Music Downloader Image 1' },
      { url: '/images/img.png', alt: 'Music Downloader Image 2' },
      { url: '/images/img.png', alt: 'Music Downloader Image 3' },
    ],
  },
  {
    slug: 'sternula',
    name: 'Sternula',
    description: 'Description for Sternula',
    images: [
      { url: '/images/img.png', alt: 'Sternula Image 1' },
      { url: '/images/img.png', alt: 'Sternula Image 2' },
      { url: '/images/img.png', alt: 'Sternula Image 3' },
    ],
  },
  {
    slug: 'dormify',
    name: 'Dormify',
    description: 'Description for Dormify',
    images: [
      { url: '/images/img.png', alt: 'Dormify Image 1' },
      { url: '/images/img.png', alt: 'Dormify Image 2' },
      { url: '/images/img.png', alt: 'Dormify Image 3' },
    ],
  },
];

onMounted(async () => {
  await nextTick(); // Ensure DOM is updated after v-for renders cards

  gsap.utils.toArray('.card').forEach((card, i) => {
    gsap.from(card, {
      opacity: 0,
      y: 50,
      duration: 0.8,
      ease: 'power3.out',
      scrollTrigger: {
        trigger: card,
        start: 'top 80%', // Animation starts when the top of the card is 80% down the viewport
        toggleActions: 'play none none none',
        once: true, // Animation plays only once
      },
    });
  });
});
</script>

<style scoped>
.projects-grid {
  display: grid;
  grid-template-columns: repeat(auto-fill, minmax(300px, 1fr));
  gap: 20px;
  padding: 20px;
}
</style>
