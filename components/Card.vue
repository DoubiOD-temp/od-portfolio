<template>
  <div class="card" ref="cardRef">
    <div class="carousel-container">
      <UCarousel
        ref="carouselRef"
        v-slot="{ item }"
        :items="images"
        :arrows="images.length > 1"
        :prev="{ onClick: onClickPrev }"
        :next="{ onClick: onClickNext }"
        class="w-full"
      >
        <img :src="item" alt="Carousel Image" class="carousel-image" />
      </UCarousel>
    </div>
    <div class="card-content">
      <h3 class="card-title">Featured Item</h3>
      <p class="card-description">Discover the elegance and style of this item.</p>
      <button class="card-button">Learn More</button>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onUnmounted } from 'vue';
import { useNuxtApp } from '#app';
import { gsap } from 'gsap';

// Define an interface for carousel API to resolve TypeScript error
interface CarouselApi {
  emblaApi?: {
    scrollTo: (index: number) => void;
  };
}

// Props for potential customization
defineProps<{
  images?: string[];
}>();

// Default images (replace with actual paths or dynamic data)
const images = ref([
  '/images/img.png',
  // Add more images if needed for testing multiple slides
  // '/images/img2.png',
]);

const cardRef = ref<HTMLElement | null>(null);
const carouselRef = ref<CarouselApi | null>(null);
const activeIndex = ref(0);
let ctx: gsap.Context;

// Navigation methods for carousel
const onClickPrev = () => {
  activeIndex.value--;
  if (carouselRef.value?.emblaApi) {
    carouselRef.value.emblaApi.scrollTo(activeIndex.value);
  }
};

const onClickNext = () => {
  activeIndex.value++;
  if (carouselRef.value?.emblaApi) {
    carouselRef.value.emblaApi.scrollTo(activeIndex.value);
  }
};

// GSAP animations for card appearance and hover effects
const { $gsap } = useNuxtApp();

onMounted(() => {
  if (cardRef.value) {
    // Add event listeners for hover effects
    cardRef.value.addEventListener('mouseenter', () => {
      $gsap.to(cardRef.value, {
        scale: 1.02,
        boxShadow: '0 10px 20px rgba(0, 0, 0, 0.1)',
        duration: 0.3,
      });
    });
    cardRef.value.addEventListener('mouseleave', () => {
      $gsap.to(cardRef.value, {
        scale: 1,
        boxShadow: '0 5px 10px rgba(0, 0, 0, 0.05)',
        duration: 0.3,
      });
    });
  }

  ctx = $gsap.context(() => {
    // Initial card appearance animation (for scroll or load)
    if (cardRef.value) {
      $gsap.from(cardRef.value, {
        y: 50,
        opacity: 0,
        duration: 0.8,
        ease: 'power3.out',
        scrollTrigger: {
          trigger: cardRef.value,
          start: 'top 80%',
          end: 'bottom 20%',
          toggleActions: 'play none none reverse',
        },
      });
    }
  }, cardRef.value);
});

onUnmounted(() => {
  ctx?.kill(); // Clean up animations to prevent memory leaks
});
</script>

<style scoped>
.card {
  background: white;
  border-radius: 12px;
  overflow: hidden;
  box-shadow: 0 5px 10px rgba(0, 0, 0, 0.05);
  transition: transform 0.3s ease, box-shadow 0.3s ease;
  max-width: 350px;
  margin: 0 auto;
  will-change: transform, opacity; /* Performance optimization */
}

.carousel-container {
  width: 100%;
  height: 220px;
  overflow: hidden;
}

.carousel-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  transition: transform 0.5s ease;
}

.carousel-image:hover {
  transform: scale(1.05); /* Subtle zoom on hover */
}

.card-content {
  padding: 20px;
  text-align: center;
}

.card-title {
  font-size: 1.5rem;
  font-weight: 600;
  color: #333;
  margin-bottom: 10px;
}

.card-description {
  font-size: 0.9rem;
  color: #666;
  margin-bottom: 15px;
}

.card-button {
  background: #333;
  color: white;
  border: none;
  padding: 10px 20px;
  border-radius: 8px;
  cursor: pointer;
  font-size: 0.9rem;
  transition: background 0.3s ease;
}

.card-button:hover {
  background: #555;
}
</style>
