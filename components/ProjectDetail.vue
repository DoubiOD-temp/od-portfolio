<template>
    <div class="project-detail"> <button
        @click="$emit('close')"
        class="back-button"
        :class="{ 'is-mobile-back': isMobile }"
      >← Back to List</button>
  
      <div class="detail-content">
        <img v-if="project.image" :src="project.image" :alt="`${project.title} details`" class="detail-image" loading="lazy"/>
        <h2>{{ project.title }}</h2>
        <span v-if="project.tag" class="detail-tag">{{ project.tag }}</span>
        <p>{{ project.description }}</p>
        <a v-if="project.link && project.link !== '#'" :href="project.link" target="_blank" rel="noopener noreferrer" class="detail-link">
          Visit Project →
        </a>
        </div>
    </div>
  </template>
  
  <script setup lang="ts">
  import { computed } from 'vue';
  
  interface Project {
    title: string; tag?: string; description: string; image?: string; link?: string;
  }
  // Accept isMobile prop from parent for direct styling control
  const props = defineProps<{ project: Project; isMobile?: boolean }>();
  defineEmits(['close']);
  
  </script>
  
  <style scoped>
  /* Keep existing styles */
  .project-detail {
    position: sticky;
    margin-top: 5rem;
    top: 0; /* Stick to the top of the viewport */
    /* Base styles applied globally */
    /* background-color: #f9fafb; */ /* Background applied in parent CSS */
  }
  
  .back-button {
    background: none; border: none; color: #4f46e5; font-weight: 600; cursor: pointer;
    margin-bottom: 1.5rem; font-size: 0.95rem; padding: 0.3rem 0;
    display: block; /* Ensure it takes space */
  }
  .back-button:hover { text-decoration: underline; }
  
  /* --- Mobile Specific Back Button --- */
  .back-button.is-mobile-back {
      position: fixed; /* Fix to top left */
      top: 1rem;
      left: 1rem;
      z-index: 1001; /* Above detail content */
      background-color: rgba(255, 255, 255, 0.7); /* Semi-transparent background */
      backdrop-filter: blur(5px); /* Blur effect */
      padding: 0.5rem 0.8rem;
      border-radius: 6px;
      margin-bottom: 0; /* Override margin */
      box-shadow: 0 2px 5px rgba(0,0,0,0.1);
  }
  
  
  .detail-content {
    text-align: left;
  }
  
  /* Apply top padding for desktop views */
  @media (min-width: 768px) {
    .detail-content {
      padding-top: 2rem; /* Add top padding */
    }
  }
  .detail-image { width: 100%; max-height: 300px; object-fit: cover; border-radius: 6px; margin-bottom: 1.5rem; background-color: #eee; }
  .detail-content h2 { font-size: 1.8rem; color: #312e81; margin-bottom: 0.5rem; }
  .detail-tag { display: inline-block; background-color: #e0e7ff; color: #4338ca; padding: 0.25rem 0.6rem; border-radius: 4px; font-size: 0.8rem; font-weight: 600; margin-bottom: 1rem; }
  .detail-content p { font-size: 1rem; color: #374151; line-height: 1.6; margin-bottom: 1.5rem; }
  .detail-link { display: inline-block; background-color: #34d399; color: white; padding: 0.7rem 1.2rem; border-radius: 6px; text-decoration: none; font-weight: 600; transition: background-color 0.2s ease; }
  .detail-link:hover { background-color: #10b981; }
  </style>
