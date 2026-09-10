<template>
  <div class="project-detail-container" data-detail-frame>
    <div class="project-detail-toolbar" data-detail-part data-detail-toolbar>
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
    </div>

    <div class="project-detail-content">
      <div class="image-display-container" data-detail-part data-detail-image>
        <swiper
          v-if="project.images && project.images.length > 0"
          :key="project.title"
          :modules="modules"
          :slides-per-view="1"
          :space-between="0"
          navigation
          :pagination="{ clickable: true }"
          :loop="project.images.length > 1"
          class="mySwiper"
          :autoplay="autoplayOptions"
        >
          <swiper-slide v-for="(image, index) in project.images" :key="index">
            <NuxtImg
              :src="image"
              :alt="`${project.title} image ${index + 1}`"
              loading="lazy"
              decoding="async"
              class="display-image"
              placeholder
              sizes="(max-width: 767px) 100vw, (max-width: 1100px) 90vw, 1100px"
            />
          </swiper-slide>
        </swiper>
        <NuxtImg
          v-else-if="project.image"
          :src="project.image"
          :alt="project.title"
          loading="lazy"
          decoding="async"
          class="display-image"
          placeholder
          sizes="(max-width: 767px) 100vw, (max-width: 1100px) 90vw, 1100px"
        />
      </div>

      <div class="details-section">
        <h1 data-detail-part data-detail-reveal>{{ project.title }}</h1>

        <div class="meta-info" data-detail-part data-detail-reveal>
           <div v-if="project.year" class="meta-item">
            <span class="meta-label">Year:</span>
            <span class="meta-value">{{ project.year }}</span>
          </div>

          <div v-if="project.collaborators" class="meta-item">
            <span class="meta-label">Collaborators:</span>
            <span class="meta-value">{{ project.collaborators }}</span>
          </div>
        </div>

        <div v-if="project.githubLink" class="github-link-container" data-detail-part data-detail-reveal>
          <a :href="project.githubLink" target="_blank" rel="noopener noreferrer" class="github-link" :aria-label="isGithubLink ? 'View on GitHub' : 'View website'">
            <svg v-if="isGithubLink" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="github-icon" aria-hidden="true">
              <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
            </svg>
            <svg v-else xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2" stroke-linecap="round" stroke-linejoin="round" class="github-icon">
              <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"/>
              <polyline points="15 3 21 3 21 9"/>
              <line x1="10" y1="14" x2="21" y2="3"/>
            </svg>
            <span>{{ isGithubLink ? 'View on GitHub' : 'View website' }}</span>
          </a>
        </div>

        <div v-if="project.description" class="description-section" data-detail-part data-detail-reveal>
             <span class="section-label">Description:</span>
             <p class="full-description">{{ project.description }}</p>
        </div>

        <div v-if="project.highlights && project.highlights.length > 0" class="highlights-section" data-detail-part data-detail-reveal>
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
import { computed, inject, defineAsyncComponent, shallowRef, onMounted, nextTick, watch } from 'vue';
import { gsap } from 'gsap';

const Swiper = defineAsyncComponent(() =>
  import('swiper/vue').then((m) => m.Swiper)
);
const SwiperSlide = defineAsyncComponent(() =>
  import('swiper/vue').then((m) => m.SwiperSlide)
);

const modulesLoaded = shallowRef<any[] | null>(null);

onMounted(async () => {
  const [{ Navigation, Pagination, Autoplay }] = await Promise.all([
    import('swiper/modules'),
    import('swiper/css'),
    import('swiper/css/navigation'),
    import('swiper/css/pagination'),
    import('swiper/css/autoplay')
  ]);
  modulesLoaded.value = isLowEndDevice() ? [Pagination] : [Navigation, Pagination, Autoplay];
});

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

const isGithubLink = computed(() => /(^|\/\/)([^/]*\.)?github\.com/i.test(props.project.githubLink ?? ''));

// Check if device is low-end
const isLowEndDevice = inject('isLowEndDevice', () => false);

// Modules are loaded asynchronously after mount (see onMounted above)
const modules = computed(() => modulesLoaded.value ?? []);

// Swiper options - adjust based on device capabilities
const autoplayOptions = computed(() => isLowEndDevice() ? false : ({
  delay: 5000,
  disableOnInteraction: false,
  pauseOnMouseEnter: true
}));

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

watch(
  () => props.project.title,
  async (title, previousTitle) => {
    if (!previousTitle || title === previousTitle || props.isMobile || prefersReducedMotion()) {
      return;
    }

    await nextTick();

    const targets = document.querySelectorAll(
      '.project-detail-component:not(.is-mobile) [data-detail-image], .project-detail-component:not(.is-mobile) [data-detail-reveal]'
    );

    gsap.killTweensOf(targets);
    gsap.fromTo(
      targets,
      { opacity: 0, y: 12, filter: 'blur(5px)' },
      {
        opacity: 1,
        y: 0,
        filter: 'blur(0px)',
        duration: 0.3,
        stagger: 0.045,
        ease: 'power2.out',
        force3D: true,
        onComplete: () => {
          gsap.set(targets, { clearProps: 'transform,opacity,filter' });
        },
      }
    );
  }
);

</script>

<style scoped>
/* --- Base Container --- */
.project-detail-container {
  max-width: 1100px; /* Max width for content on larger screens */
  margin: 0 auto;
  background-color: #fff; /* Clean white background */
  overflow: visible;
  margin-left: auto !important;
  margin-right: auto !important;
  scrollbar-color: rgba(77, 99, 187, 0.36) transparent;
  scrollbar-width: thin;
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
  gap: 0.45rem;
  background: none;
  border: none;
  color: #4D63BB; /* iOS-like blue */
  font-size: 1rem;
  font-weight: 500;
  cursor: pointer;
  padding: 0.45rem 0.15rem;
  transition-property: color, transform;
  transition-duration: 0.2s, 0.18s;
  transition-timing-function: ease, cubic-bezier(0.2, 0, 0, 1);
  -webkit-tap-highlight-color: transparent;
  margin: 0;
  min-height: 40px;
}

.back-button:hover {
  color: #005bb5;
  text-decoration: none;
}

.back-button:active {
  transform: scale(0.96);
}

.back-icon {
    width: 1.35em;
    height: 1.35em;
    flex-shrink: 0;
}

/* --- Mobile Specific Back Button --- */
.project-detail-container.is-mobile .project-detail-toolbar {
  position: sticky;
  top: -1.5rem;
  z-index: 1001;
  display: flex;
  align-items: center;
  margin: -1.5rem -1.5rem 0;
  padding: calc(env(safe-area-inset-top, 0px) + 0.75rem) 1rem 0.75rem;
}

.back-button.is-mobile-back {
  justify-content: center;
  width: 44px;
  height: 44px;
  min-height: 44px;
  padding: 0;
  gap: 0;
  background-color: rgba(255, 255, 255, 0.85); /* Slightly less transparent */
  border-radius: 999px;
  margin-bottom: 0;
  box-shadow: 0 8px 22px rgba(15, 23, 42, 0.12);
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

.project-detail-container:not(.is-mobile) {
  max-width: none;
  min-height: 0;
  height: 100vh;
  height: 100dvh;
  max-height: none;
  margin: 0 !important;
  padding: 0;
  overflow-y: auto;
  overflow-x: hidden;
}

.project-detail-container:not(.is-mobile) .project-detail-toolbar {
  position: sticky;
  top: 0;
  z-index: 30;
  display: flex;
  align-items: center;
  width: 100%;
  height: 53px;
  min-height: 53px;
  padding: 0 1.5rem;
  border-radius: 14px 14px 0 0;
  background: #fff;
  box-shadow: 0 1px 0 rgba(15, 23, 42, 0.08), 0 10px 24px rgba(15, 23, 42, 0.04);
}

.project-detail-container:not(.is-mobile) .back-button {
  width: auto;
  padding: 0 0.35rem 0 0.15rem;
  background: white;
}

.project-detail-container:not(.is-mobile) .project-detail-content {
  padding: 1.5rem;
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

.project-detail-container:not(.is-mobile) .image-display-container {
  border-radius: 12px;
  overflow: hidden;
  box-shadow: inset 0 0 0 1px rgba(15, 23, 42, 0.08);
}

.project-detail-container:not(.is-mobile) .display-image {
  max-height: min(48vh, 440px);
  object-fit: contain;
}


/* Adjust Swiper Navigation (Arrows) */
:deep(.swiper-button-next),
:deep(.swiper-button-prev) {
  color: #5f74c2; /* Blue arrows */
   filter: drop-shadow(0 1px 2px rgba(0,0,0,0.1)); /* Subtle shadow */
  opacity: 0.65; /* Slightly more opaque */
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
  color: #4D63BB;
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
    margin-top: 0.5rem; /* Add space above dots */
    margin-bottom: 0.5rem; /* Add space below dots */
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
  margin-bottom: 3.5rem;
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
  }

  .project-detail-container:not(.is-mobile) {
    padding: 0;
  }

  .image-display-container {
      margin: 0 -1.5rem 1.5rem -1.5rem; /* Negative margin matches desktop padding */
  }

  .project-detail-container:not(.is-mobile) .image-display-container {
      margin: -1.5rem -1.5rem 1.5rem -1.5rem;
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
