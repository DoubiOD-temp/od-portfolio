<template>
  <div class="project-detail-container">
    <button
      @click="$emit('close')"
      class="back-button"
      :class="{ 'is-mobile-back': isMobile }"
      aria-label="Back to project list"
    >
      <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="2.5" stroke="currentColor" class="back-icon">
        <path stroke-linecap="round" stroke-linejoin="round" d="M10.5 19.5L3 12m0 0l7.5-7.5M3 12h18" />
      </svg>
      <span :class="{ 'sr-only': isMobile }">Back to List</span>
    </button>

    <div class="project-detail-content">
      <div class="image-display-container">
        <swiper
          v-if="project.images && project.images.length > 0"
          :modules="modules"
          :slides-per-view="1"
          :space-between="0"
          navigation
          :pagination="{ clickable: true }"
          :loop="project.images.length > 1"
          class="mySwiper"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
        >
          <swiper-slide v-for="(image, index) in project.images" :key="index">
            <NuxtImg
              :src="image"
              :alt="`${project.title} image ${index + 1}`"
              loading="lazy"
              class="display-image"
              placeholder
              format="webp"
            />
          </swiper-slide>
        </swiper>
        <NuxtImg
          v-else-if="project.image"
          :src="project.image"
          :alt="project.title"
          loading="lazy"
          class="display-image"
          placeholder
          format="webp"
        />
      </div>

      <div class="details-section">
        <h1>{{ project.title }}</h1>

        <div class="meta-info">
           <div v-if="project.year" class="meta-item">
            <span class="meta-label">Year:</span>
            <span class="meta-value">{{ project.year }}</span>
          </div>

          <div v-if="project.collaborators" class="meta-item">
            <span class="meta-label">Collaborators:</span>
            <span class="meta-value">{{ project.collaborators }}</span>
          </div>
        </div>

        <div v-if="project.githubLink" class="github-link-container">
          <a :href="project.githubLink" target="_blank" rel="noopener noreferrer" class="github-link" aria-label="View on GitHub">
            <NuxtImg src="/images/github.png" alt="GitHub" class="github-icon"/>
            <span>View on GitHub</span>
          </a>
        </div>

        <div v-if="project.description" class="description-section">
             <span class="section-label">Description:</span>
             <p class="full-description">{{ project.description }}</p>
        </div>

        <div v-if="project.highlights && project.highlights.length > 0" class="highlights-section">
          <span class="section-label">Highlights:</span>
          <ul class="highlights-list">
            <li v-for="(highlight, index) in project.highlights" :key="index" class="highlight-item">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="highlight-bullet">
                <path fill-rule="evenodd" d="M2.25 12c0-5.385 4.365-9.75 9.75-9.75s9.75 4.365 9.75 9.75-4.365 9.75-9.75 9.75S2.25 17.385 2.25 12zm13.36-1.814a.75.75 0 10-1.22-.872l-3.236 4.53L9.53 12.22a.75.75 0 00-1.06 1.06l2.25 2.25a.75.75 0 001.14-.094l3.75-5.25z" clip-rule="evenodd" />
              </svg>
              {{ highlight }}
            </li>
          </ul>
        </div>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { computed, ref, onMounted, inject } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

import 'swiper/css/bundle';

// Define the Project interface exactly as provided by the user
interface Project {
  title: string;
  tags?: string[]; // Still in interface but not displayed
  shortDescription: string; // Still in interface but not displayed
  description: string;
  collaborators?: number | string;
  highlights?: string[];
  image?: string;
  images?: string[];
  githubLink?: string;
  year?: number | string;
}

// Accept props
const props = defineProps<{ project: Project; isMobile?: boolean }>();
defineEmits(['close']);

// Check if device is low-end
const isLowEndDevice = inject('isLowEndDevice', () => false);

// Swiper modules to use - reduce modules for low-end devices
const modules = computed(() => {
  // Only include Pagination on low-end devices
  return isLowEndDevice()
    ? [Pagination]
    : [Navigation, Pagination, Autoplay];
});

// Swiper options - adjust based on device capabilities
const swiperOptions = computed(() => ({
  delay: isLowEndDevice() ? 7000 : 5000, // Longer delay for low-end devices
  disableOnInteraction: false,
  pauseOnMouseEnter: true
}));

</script>

<style scoped>
/* --- Base Container --- */
.project-detail-container {
  max-width: 1100px; /* Max width for content on larger screens */
  margin: 0 auto;
  background-color: #fff; /* Clean white background */
  overflow: hidden;
  margin-left: auto !important;
  margin-right: auto !important;
}

/* Add more bottom padding for mobile */
@media (max-width: 767px) {
    .project-detail-container {
        padding-bottom: 2rem; /* Increased bottom padding */
    }
     /* Adjust padding inside content if needed due to back button */
    .project-detail-content {
        padding-top: 1rem; /* Ensure content starts below fixed button */
    }
}

/* --- Back Button --- */
.back-button {
  display: inline-flex;
  align-items: center;
  gap: 0.4rem;
  background: none;
  border: none;
  color: #4D63BB; /* iOS-like blue */
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s ease-in-out;
  -webkit-tap-highlight-color: transparent;
  margin-bottom: 1rem;
}

.back-button:hover {
  color: #005bb5;
  text-decoration: none;
}

.back-icon {
    width: 1.2em;
    height: 1.2em;
    margin-right: 0.2rem;
}

/* --- Mobile Specific Back Button (Fixed Position) --- */
.back-button.is-mobile-back {
  position: fixed;
  /* Move slightly higher */
  top: 0.75rem; /* Adjusted from 1rem */
  left: 1rem;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.85); /* Slightly less transparent */
  backdrop-filter: blur(10px); /* Slightly stronger blur */
  -webkit-backdrop-filter: blur(10px); /* Safari support */
  padding: 0.4rem 0.7rem; /* Slightly less padding */
  border-radius: 8px;
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  width: auto;
  height: auto;
}

/* Screen Reader Only utility class */
.sr-only {
  position: absolute;
  width: 1px;
  height: 1px;
  padding: 0;
  margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  white-space: nowrap;
  border-width: 0;
}

/* --- Main Content Area --- */
.project-detail-content {
  text-align: left;
}

/* --- Image Display (Carousel or Single) --- */
.image-display-container {
    margin: 0 -1rem 1.5rem -1rem; /* Negative margins to span full container width despite padding */
    /* Remove border-radius and shadow from container to let image styles handle it */
    /* background-color: #e0e0e0; /* Placeholder background */
}

/* Swiper Carousel Styles (adjusting for full image display) */
.mySwiper {
  width: 100%;
  height: auto; /* Allow height to be determined by image aspect ratio */
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #f8f8f8; /* Subtle slide background */
  display: flex;
  justify-content: center;
  align-items: center;
}

.display-image {
  display: block;
  width: 100%; /* Take full width */
  height: auto; /* Maintain aspect ratio */
  /* object-fit: contain; /* Use contain if you need to ensure the whole image is visible without cropping */
  /* Or simply remove object-fit to let width/height auto handle it */
  /* If image is smaller than container, it will be centered by flexbox on parent */
  /* object-fit: cover; is removed */
  border-radius: 0; /* Remove border radius here, apply elsewhere if needed */
  /* box-shadow: 0 4px 10px rgba(0,0,0,0.05); /* Subtle shadow on the image itself */
  background-color: #eee; /* Placeholder background while loading */
}


/* Adjust Swiper Navigation (Arrows) */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #4D63BB; /* Blue arrows */
   filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)); /* Subtle shadow */
  opacity: 0.9; /* Slightly more opaque */
  transition: opacity 0.2s ease-in-out, color 0.2s ease-in-out;
  top: 50%; /* Keep centered vertically */
  transform: translateY(-50%); /* Correct vertical centering */
  /* Add larger tap area */
  padding: 15px;
   margin: -15px; /* Negative margin to include padding in click area */
   z-index: 10; /* Ensure they are above images and pagination */
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  color: #005bb5;
  opacity: 1;
}

/* Hide navigation on small screens if preferred */
@media (max-width: 500px) {
    :deep(.swiper-button-next),
    :deep(.swiper-button-prev) {
        display: none;
    }
}


/* Adjust Swiper Pagination (Dots) */
:deep(.swiper-pagination-bullet) {
  background-color: #5f74c2; /* Blue dots */
  opacity: 0.4;
  transition: opacity 0.2s ease-in-out;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #4D63BB; /* Active dot color */
  opacity: 0.8; /* More opaque when active */
}

/* Position pagination below the image */
:deep(.swiper-pagination.swiper-pagination-bullets) {
    position: relative; /* Change to relative */
    bottom: auto; /* Remove fixed bottom */
    margin-top: 1rem; /* Add space above dots */
}


/* --- Details Content Styling --- */
.details-section {
  padding: 0 0 1rem; /* No horizontal padding inside this section, container handles it */
}

h1 {
  font-size: 1.8rem; /* Smaller title */
  color: #1a1a1a;
  margin-bottom: 0.5rem;
  line-height: 1.3;
  font-weight: 600; /* Slightly bolder title */
}


.meta-info {
  display: flex;
  flex-wrap: wrap;
  gap: 1.5rem;
  margin-bottom: 1.5rem;
}

.meta-item {
    display: flex;
    flex-direction: column;
}

.meta-label {
  font-size: 0.85rem; /* Slightly smaller label */
  color: #666; /* Medium grey for labels */
  font-weight: 500;
  text-transform: uppercase;
  margin-bottom: 0.2rem;
  letter-spacing: 0.05em; /* Subtle letter spacing */
}

.meta-value {
  font-size: 1rem;
  color: #333;
  font-weight: 400;
}


/* --- GitHub Link Styling --- */
.github-link-container {
  margin-bottom: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem;
  color: #4D63BB;
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.github-link:hover {
  color: #005bb5;
}

.github-icon {
  width: 1.3rem; /* Slightly smaller icon */
  height: 1.3rem;
  object-fit: contain;
}

/* --- Description and Highlights Sections --- */
.description-section,
.highlights-section {
  margin-bottom: 1.5rem;
  border-top: 1px solid #eee;
  padding-top: 1.5rem;
}

.section-label {
    font-size: 0.85rem; /* Slightly smaller label */
    color: #666; /* Medium grey for labels */
    font-weight: 500;
    text-transform: uppercase;
    display: block;
    margin-bottom: 0.6rem;
     letter-spacing: 0.05em; /* Subtle letter spacing */
}

.full-description {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

/* --- Highlights List Styling --- */
.highlights-list {
  list-style: none;
  padding: 0;
  margin: 0;
}

.highlight-item {
  display: flex;
  align-items: flex-start;
  margin-bottom: 0.8rem;
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
}

.highlight-bullet {
    width: 1.2em;
    height: 1.2em;
    color: #4D63BB;
    flex-shrink: 0;
    margin-right: 0.6rem;
    margin-top: 0.2em;
}

/* --- Responsive Adjustments --- */
@media (min-width: 768px) {
  .project-detail-container {
    padding: 1.5rem; /* More padding on desktop */
    margin-top: 5rem; /* Keep the top margin on desktop too */
  }

  .image-display-container {
      margin: 0 -1.5rem 1.5rem -1.5rem; /* Negative margin matches desktop padding */
  }

  h1 {
    font-size: 2rem; /* Slightly larger title on desktop */
  }

   .github-link-container,
   .description-section,
   .highlights-section {
      padding-top: 2rem; /* More space after dividers on desktop */
   }
}
</style>