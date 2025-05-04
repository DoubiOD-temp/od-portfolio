<template>
  <section>
    <div class="heading">
      <Vue3Lottie
        ref="headingLottie"
        animation-link="/animations/od-portfolio.json"
        :loop="false"
        :autoplay="true"
        :delay="700"
      />
    </div>
    <div class="lottie-container">
      <Vue3Lottie
        ref="iphoneLottie"
        animation-link="/animations/iphone.json"
        :loop="false"
        :autoplay="true"
        :delay="2900"
      />
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';

const headingLottie = ref(null);
const iphoneLottie = ref(null);

onMounted(() => {
  // Play the first animation immediately after page load
  headingLottie.value?.play();

  // Delay the second animation by 2200ms
  setTimeout(() => {
    iphoneLottie.value?.play();
  }, 2200);
});
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