<template>
  <div class="card">
    <div class="card-image-container">
      <img v-if="image" :src="image" alt="" class="card-image" />
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <span v-if="tag" class="card-tag">{{ tag }}</span>
      </div>
      <p class="card-description">{{ description }}</p>
      <a :href="link" class="card-link">See More →</a>
    </div>
  </div>
</template>

<script setup>
defineProps(['title', 'tag', 'description', 'image', 'link'])
</script>