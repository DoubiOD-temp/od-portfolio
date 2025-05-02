<template>
    <section>
      <div class="heading">
        <Vue3Lottie
          animation-link="/animations/od-portfolio.json"
          :loop="false"
          :autoplay="true"
        />
      </div>
      <div class="lottie-container">
        <Vue3Lottie
          animation-link="/animations/iphone.json"
          :loop="false"
          :autoplay="true"
          :delay="2200"
          :class="lottie-container"
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

.heading {
  max-width: 628px;
  width: 100%;       /* Fill available space up to max-width */
  margin: 0 auto; 
}

.lottie-container {
  max-width: 400px;  /* Maximum width constraint */
  width: 100%;       /* Fill available space up to max-width */
  margin: 0 auto;    /* Center the container */
  padding-bottom: 3rem;
}

/* Force Lottie canvas to respect container dimensions */
.lottie-container :deep(canvas) {
  width: 100% !important;
  height: auto !important;
}
</style>