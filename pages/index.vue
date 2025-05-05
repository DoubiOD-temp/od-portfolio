<template>
  <section>
    <div class="heading">
      <client-only>
        <Vue3Lottie
          ref="headingLottie"
          animation-link="/animations/od-portfolio.json"
          :loop="false"
          :autoplay="true"
          :delay="700"
          :options="lottieOptions"
        />
      </client-only>
    </div>
    <div class="lottie-container">
      <client-only>
        <Vue3Lottie
          ref="iphoneLottie"
          animation-link="/animations/iphone.json"
          :loop="false"
          :autoplay="true"
          :delay="2900"
          :options="lottieOptions"
        />
      </client-only>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, inject } from 'vue';

const headingLottie = ref(null);
const iphoneLottie = ref(null);
const isLowEndDevice = inject('isLowEndDevice', () => false);

// lottieOptions is not currently used in the playback logic, but you can keep it.
// If you intended to pass these options to the component, you would use a prop like :options="lottieOptions"
// if the Vue3Lottie component supports it. The docs show using rendererSettings directly as props.
const lottieOptions = {
  rendererSettings: {
    progressiveLoad: true,
    preserveAspectRatio: 'xMidYMid meet'
  }
};

onMounted(() => {
  // Use requestIdleCallback or setTimeout for non-critical initialization
  const initLottie = () => {
    // Play the first animation immediately after page load
    // Check if the ref exists AND if the component instance has a play method
    if (headingLottie.value && headingLottie.value.play) {
      headingLottie.value.play();
    }

    // Delay the second animation
    setTimeout(() => {
      // Check if the ref exists AND if the component instance has a play method
      if (iphoneLottie.value && iphoneLottie.value.play) {
        iphoneLottie.value.play();
      }
    }, isLowEndDevice() ? 2500 : 2200); // Longer delay on low-end devices
  };

  // Use requestIdleCallback if available, fallback to setTimeout
  // Ensure window is defined before accessing it (important for SSR safety)
  if (typeof window !== 'undefined' && 'requestIdleCallback' in window) {
    window.requestIdleCallback(initLottie);
  } else if (typeof window !== 'undefined') { // Fallback setTimeout
    setTimeout(initLottie, 50);
  }
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