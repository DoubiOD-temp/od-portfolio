<template>
  <div class="card">
    <div class="card-image-container">
      <img v-if="image" :src="image" :alt="`${title} project image`" class="card-image" loading="lazy" />
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <span v-if="tag" class="card-tag">{{ tag }}</span>
      </div>
      <p class="card-description">{{ description }}</p>
      <button
        @click="$emit('view-details', { title, tag, description, image, link })"
        class="card-button"
        :disabled="isSelected"
        :class="{ 'disabled': isSelected }"
      >
          View More →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  title: string;
  tag?: string;
  description: string;
  image?: string;
  link?: string;
}
defineProps<{
  title: string;
  tag?: string;
  description: string;
  image?: string;
  link?: string;
  isSelected?: boolean; // Add isSelected prop
}>();
defineEmits(['view-details']);
</script>

<style scoped>
/* --- Base (Mobile-First) Styles --- */
.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 1rem; /* Margin around the card */
  width: calc(100% - 2rem); /* Full width minus margins on mobile */
  max-width: 320px; /* Max width on mobile */
  overflow: hidden;
  display: flex;
  flex-direction: column; /* Stack image and content vertically */
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-image-container {
  width: 100%;
  height: 180px;
  overflow: hidden;
  background-color: #eee;
  flex-shrink: 0; /* Prevent shrinking */
}

.card-image {
  width: 100%;
  height: 100%;
  object-fit: cover;
  display: block;
}

.card-content {
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
}

.card-header {
  display: flex;
  justify-content: space-between;
  align-items: flex-start;
  margin-bottom: 0.5rem;
  flex-wrap: wrap; /* Allow tag to wrap if needed */
  gap: 0.5rem; /* Space between title and tag if they wrap */
}

.card-title {
  font-size: 1.1rem; /* Adjusted size */
  font-weight: 700;
  color: #312e81;
  margin: 0;
  line-height: 1.3;
  /* Allow title to take available space, pushing tag */
  flex-grow: 1;
  /* Prevent tag from pushing title too much */
  min-width: 60%;
}

.card-tag {
  background-color: #e0e7ff;
  color: #4338ca;
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 600;
  white-space: nowrap;
  flex-shrink: 0; /* Prevent tag from shrinking */
}

.card-description {
  font-size: 0.9rem;
  color: #4b5563;
  line-height: 1.5;
  margin-bottom: 1rem;
  flex-grow: 1; /* Push button to bottom */
}

.card-button {
  background-color: #4f46e5;
  color: white;
  border: none;
  padding: 0.6rem 1rem;
  border-radius: 6px;
  font-size: 0.9rem;
  font-weight: 600;
  cursor: pointer;
  text-decoration: none;
  text-align: center;
  transition: background-color 0.2s ease;
  align-self: flex-start;
  margin-top: auto; /* Ensure button stays at bottom */
}

.card-button:hover {
  background-color: #4338ca;
}

/* --- Desktop Styles (Horizontal Layout) --- */
@media (min-width: 768px) { /* Adjust breakpoint as needed */
  .card {
    flex-direction: row; /* Arrange image and content horizontally */
    max-width: 650px; /* Wider card */
    width: 100%; /* Allow it to take space in the flex container */
    align-items: stretch; /* Stretch items to fill height */
  }

  .card-image-container {
    width: 220px; /* Fixed width for image container */
    height: auto; /* Auto height based on content */
    /* Reset height from mobile */
  }

   .card-image {
    /* Ensure image fills the fixed width container */
     height: 100%; /* Make image fill container height */
     object-fit: cover;
  }


  .card-content {
    padding: 1.2rem 1.5rem; /* Slightly more padding */
    /* Content takes remaining space */
    flex-grow: 1;
    width: auto; /* Allow flexbox to manage width */
  }

   .card-title {
        font-size: 1.15rem;
   }

   .card-description {
     font-size: 0.95rem;
   }
}

/* --- Disabled Button Styles --- */
.card-button:disabled,
.card-button.disabled {
  background-color: #cccccc; /* Grey out the button */
  cursor: not-allowed; /* Indicate it's not clickable */
  opacity: 0.7; /* Slightly fade it */
}

.card-button:disabled:hover,
.card-button.disabled:hover {
  background-color: #cccccc; /* Keep grey on hover */
}
</style>