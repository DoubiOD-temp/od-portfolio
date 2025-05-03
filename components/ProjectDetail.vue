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
      <div v-if="project.images && project.images.length > 0" class="image-carousel-container">
        <swiper
          :modules="modules"
          :slides-per-view="1"
          :space-between="20"
          navigation
          :pagination="{ clickable: true }"
          :loop="project.images.length > 1"
          class="mySwiper"
          :autoplay="{ delay: 5000, disableOnInteraction: false }"
        >
          <swiper-slide v-for="(image, index) in project.images" :key="index">
            <img
              :src="image"
              :alt="`${project.title} image ${index + 1}`"
              loading="lazy"
              class="carousel-image"
            />
          </swiper-slide>
        </swiper>
      </div>
      <div v-else-if="project.image" class="single-image-container">
         <img :src="project.image" :alt="`${project.title}`" loading="lazy" class="detail-image"/>
       </div>


      <div class="details-section">
        <h1>{{ project.title }}</h1>

        <p v-if="project.shortDescription" class="short-description">
          {{ project.shortDescription }}
        </p>

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


        <div v-if="project.tags && project.tags.length > 0" class="tags-container">
          <span class="meta-label">Tags:</span>
          <div class="tags-list">
            <span v-for="(tag, index) in project.tags" :key="index" class="project-tag">
              {{ tag }}
            </span>
          </div>
        </div>

        <div v-if="project.githubLink" class="github-link-container">
          <a :href="project.githubLink" target="_blank" rel="noopener noreferrer" class="github-link" aria-label="View on GitHub">
            <img src="/images/github.png" alt="GitHub" class="github-icon"/>
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
import { computed } from 'vue';
import { Swiper, SwiperSlide } from 'swiper/vue';
import { Navigation, Pagination, Autoplay } from 'swiper/modules';

// Import Swiper styles
import 'swiper/css';
import 'swiper/css/navigation';
import 'swiper/css/pagination';
// Optional: If you want a fade effect
// import 'swiper/css/effect-fade';


// Define the Project interface exactly as provided by the user
interface Project {
  title: string;
  tags?: string[];
  shortDescription: string;
  description: string;
  collaborators?: number | string;
  highlights?: string[];
  image?: string; // Keeping the original image field for now
  images?: string[]; // Added list of image paths
  githubLink?: string;
  year?: number | string;
}

// Accept props, including the full Project interface and isMobile
const props = defineProps<{ project: Project; isMobile?: boolean }>();
defineEmits(['close']);

// Swiper modules to use
const modules = [Navigation, Pagination, Autoplay];

</script>

<style scoped>
/* --- Base Container --- */
.project-detail-container {
  position: relative; /* Allows absolute positioning relative to this */
  max-width: 900px; /* Max width for content on larger screens */
  margin: 0 auto; /* Center the container */
  padding: 1rem; /* Base padding */
  background-color: #f9fafb; /* Subtle background */
  border-radius: 12px; /* Soft rounded corners */
  box-shadow: 0 10px 25px rgba(0, 0, 0, 0.08); /* Subtle shadow */
  overflow: hidden; /* Hide overflowing content like large images */
  /* Add top margin to push content below sticky back button if needed */
   margin-top: 5rem;
}

/* --- Back Button --- */
.back-button {
  display: inline-flex; /* Use flex for icon and text alignment */
  align-items: center;
  gap: 0.4rem; /* Space between icon and text */
  background: none;
  border: none;
  color: #007AFF; /* iOS-like blue */
  font-size: 1rem;
  font-weight: 500; /* Medium weight */
  cursor: pointer;
  padding: 0.5rem 0;
  transition: color 0.2s ease-in-out;
  -webkit-tap-highlight-color: transparent; /* Remove tap highlight on mobile */
  margin-bottom: 1rem; /* Space below button */
}

.back-button:hover {
  color: #005bb5; /* Darker blue on hover */
  text-decoration: none; /* Remove underline on hover for cleaner look */
}

.back-icon {
    width: 1.2em; /* Size icon relative to font-size */
    height: 1.2em;
    margin-right: 0.2rem; /* Small space between icon and text */
}


/* --- Mobile Specific Back Button (Fixed Position) --- */
.back-button.is-mobile-back {
  position: fixed;
  top: 1rem;
  left: 1rem;
  z-index: 1001;
  background-color: rgba(255, 255, 255, 0.8); /* More opaque background */
  backdrop-filter: blur(8px); /* Stronger blur */
  -webkit-backdrop-filter: blur(8px); /* Safari support */
  padding: 0.5rem 0.8rem;
  border-radius: 8px; /* More rounded */
  margin-bottom: 0;
  box-shadow: 0 2px 8px rgba(0,0,0,0.1);
  /* Ensure only the icon is visible on mobile, text is SR only */
  width: auto; /* Allow button to size to content (icon only) */
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

/* --- Image Display --- */
/* Container for both carousel and single image for consistent margin */
.image-carousel-container,
.single-image-container {
    margin-bottom: 1.5rem;
    border-radius: 8px;
    overflow: hidden; /* Ensure image corners are rounded */
    box-shadow: 0 4px 12px rgba(0,0,0,0.08); /* Subtle shadow for images */
    background-color: #e0e0e0; /* Placeholder background */
}

/* Single Detail Image Styling (if not using carousel) */
.detail-image {
  display: block; /* Remove extra space below image */
  width: 100%;
  max-height: 400px; /* Limit height */
  object-fit: cover; /* Cover the area, cropping if necessary */
}


/* --- Swiper Carousel Styles --- */
.mySwiper {
  width: 100%;
  height: 100%; /* Swiper will take the height of its container */
}

.swiper-slide {
  text-align: center;
  font-size: 18px;
  background: #fff; /* Slide background */
  display: flex; /* Center slide content */
  justify-content: center;
  align-items: center;
}

.carousel-image {
  display: block;
  width: 100%;
  height: 400px; /* Fixed height for all carousel images */
  object-fit: cover; /* Cover the slide area */
  background-color: #e0e0e0; /* Placeholder */
}

/* Adjust Swiper Navigation (Arrows) */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #fff; /* White arrows */
  filter: drop-shadow(0 1px 2px rgba(0,0,0,0.3)); /* Add shadow for visibility */
  opacity: 0.7;
  transition: opacity 0.2s ease-in-out;
}

:deep(.swiper-button-next:hover),
:deep(.swiper-button-prev:hover) {
  opacity: 1;
}

/* Adjust Swiper Pagination (Dots) */
:deep(.swiper-pagination-bullet) {
  background-color: #fff; /* White dots */
  opacity: 0.6;
  transition: opacity 0.2s ease-in-out;
}

:deep(.swiper-pagination-bullet-active) {
  background-color: #fff; /* Active dot color */
  opacity: 1;
}

/* --- Details Content Styling --- */
.details-section {
  padding: 0 1rem 1rem; /* Add horizontal padding and bottom space */
}

h1 {
  font-size: 2rem; /* Larger title */
  color: #1a1a1a; /* Dark grey */
  margin-bottom: 0.5rem;
  line-height: 1.2;
}

.short-description {
  font-size: 1.1rem;
  color: #555; /* Medium grey */
  margin-bottom: 1.5rem;
  font-weight: 400; /* Regular weight */
  line-height: 1.5;
}

.meta-info {
  display: flex;
  flex-wrap: wrap; /* Allow items to wrap on smaller screens */
  gap: 1.5rem; /* Space between meta items */
  margin-bottom: 1.5rem;
}

.meta-item {
    display: flex;
    flex-direction: column; /* Label above value */
}

.meta-label {
  font-size: 0.9rem;
  color: #888; /* Light grey for labels */
  font-weight: 500; /* Medium weight */
  text-transform: uppercase; /* Uppercase labels */
  margin-bottom: 0.2rem; /* Space between label and value */
}

.meta-value {
  font-size: 1rem;
  color: #333; /* Darker grey for values */
  font-weight: 400;
}


/* --- Tags Styling --- */
.tags-container {
  margin-bottom: 1.5rem;
}

.tags-list {
  display: flex;
  flex-wrap: wrap;
  gap: 0.5rem; /* Space between tags */
  margin-top: 0.4rem; /* Space below the "Tags:" label */
}

.project-tag {
  display: inline-block;
  background-color: #eef2ff; /* Light blue */
  color: #4338ca; /* Darker blue */
  padding: 0.3rem 0.7rem;
  border-radius: 16px; /* Pill shape */
  font-size: 0.85rem;
  font-weight: 600;
  white-space: nowrap; /* Prevent tags from breaking */
}

/* --- GitHub Link Styling --- */
.github-link-container {
  margin-bottom: 1.5rem;
  border-top: 1px solid #eee; /* Subtle divider */
  padding-top: 1.5rem;
}

.github-link {
  display: inline-flex;
  align-items: center;
  gap: 0.5rem; /* Space between icon and text */
  color: #007AFF; /* iOS-like blue */
  text-decoration: none;
  font-size: 1rem;
  font-weight: 500;
  transition: color 0.2s ease-in-out;
}

.github-link:hover {
  color: #005bb5;
}

.github-icon {
  width: 1.5rem; /* Size of the icon */
  height: 1.5rem;
  object-fit: contain;
}

/* --- Description and Highlights Sections --- */
.description-section,
.highlights-section {
  margin-bottom: 1.5rem;
  border-top: 1px solid #eee; /* Subtle divider */
  padding-top: 1.5rem;
}

.section-label {
    font-size: 0.9rem;
    color: #888; /* Light grey for labels */
    font-weight: 500; /* Medium weight */
    text-transform: uppercase; /* Uppercase labels */
    display: block; /* Make label take full width */
    margin-bottom: 0.6rem; /* Space below label */
}

.full-description {
  font-size: 1rem;
  color: #333;
  line-height: 1.6;
}

/* --- Highlights List Styling --- */
.highlights-list {
  list-style: none; /* Remove default bullet points */
  padding: 0;
  margin: 0;
}

.highlight-item {
  display: flex; /* Use flex for custom bullet and text */
  align-items: flex-start; /* Align items to the top */
  margin-bottom: 0.8rem; /* Space between list items */
  font-size: 1rem;
  color: #333;
  line-height: 1.5;
}

.highlight-bullet {
    width: 1.2em; /* Size of the custom bullet icon */
    height: 1.2em;
    color: #007AFF; /* iOS-like blue for bullets */
    flex-shrink: 0; /* Prevent bullet from shrinking */
    margin-right: 0.6rem; /* Space between bullet and text */
    margin-top: 0.2em; /* Adjust vertical alignment slightly */
}


/* --- Responsive Adjustments --- */
@media (min-width: 768px) {
  .project-detail-container {
    padding: 1.5rem; /* More padding on desktop */
    margin-top: 0; /* Remove sticky margin on desktop */
  }

  .project-detail-content {
     padding-top: 0rem; /* No extra top padding needed inside */
  }

  h1 {
    font-size: 2.5rem; /* Larger title on desktop */
  }

  .short-description {
    font-size: 1.2rem;
  }

  .carousel-image,
  .detail-image {
    max-height: 500px; /* Increase max height for images */
  }

  .details-section {
    padding: 0 1.5rem 1.5rem; /* More horizontal padding on desktop */
  }

   .github-link-container,
   .description-section,
   .highlights-section {
      padding-top: 2rem; /* More space after dividers on desktop */
   }
}
</style>