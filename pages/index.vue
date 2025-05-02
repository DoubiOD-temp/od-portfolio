<template>
    <section>
      <Vue3Lottie
        animation-link="/animations/od-portfolio.json"
        :loop="false"
        :autoplay="true"
      />
      <div class="lottie-container">
        <Vue3Lottie
          animation-link="/animations/iphone.json"
          :loop="false"
          :autoplay="true"
          :delay="1800"
        />
        
    </div>
    </section>
  </template>

<script setup>
import TicTacToeGame from '~/components/TicTacToeGame.vue'; // Adjust path if necessary
</script>

<style scoped>
section {
  padding-top: 30px !important; 
}

.lottie-container {
  max-width: 400px;  /* Maximum width constraint */
  width: 100%;       /* Fill available space up to max-width */
  margin: 0 auto;    /* Center the container */
}

/* Force Lottie canvas to respect container dimensions */
.lottie-container :deep(canvas) {
  width: 100% !important;
  height: auto !important;
}
</style>