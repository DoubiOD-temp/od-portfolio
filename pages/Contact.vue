<template>
  <SiteNav></SiteNav>
  <div class="contact-container">
    <img src="/images/profile.png" alt="Profile Picture" class="profile-img">

    <h1>Ondrej Dobiš</h1>
    <p>Applied computer science student / Software developer ext.</p>

   <div class="contact-info">
     <p>Geel, Belgium</p>
     <p>+421 910 111 092 / +32 477 42 02 28</p>
     <p>dobisondrej@gmail.com</p>
   </div>

   <div class="social-links">
      <a href="https://www.linkedin.com/in/ondrej-dobis/" target="_blank">
        <img src="/images/linkedin.png" alt="LinkedIn">
      </a>
      <a href="https://github.com/DoubiOD-temp" target="_blank">
        <img src="/images/github.png" alt="GitHub">
      </a>
       <a href="https://github.com/DoubiOD" target="_blank">
        <img src="/images/github.png" alt="GitHub">
      </a>
    </div>

    <div class="cv-button">
      <Vue3Lottie
        ref="lottieAnimation"
        :animationData="ButtonAnimation"
        :height="200"
        :width="200"
        :loop="false"
        :delay="400"
        @click="downloadCV"
      />
    </div>
  </div>
</template>

<script setup>
import { ref, onMounted, onUnmounted } from 'vue';
import ButtonAnimation from '~/public/animations/Button.json';

const lottieAnimation = ref(null);

const downloadCV = () => {
  window.open('/CV/Ondrej_Dobis-CV-3_2025.pdf', '_blank');
};

onMounted(() => {
  // Start the animation initially
  if (lottieAnimation.value) {
    lottieAnimation.value.play();
  }

  // Set up interval to play animation every 6 seconds
  const intervalId = setInterval(() => {
    if (lottieAnimation.value) {
      lottieAnimation.value.play();
    }
  }, 6000); // 6000 milliseconds = 6 seconds

  // Store intervalId to clear it later
  lottieAnimation.value.intervalId = intervalId;
});

onUnmounted(() => {
  // Clear the interval when the component is unmounted
  if (lottieAnimation.value && lottieAnimation.value.intervalId) {
    clearInterval(lottieAnimation.value.intervalId);
  }
});
</script>

<style scoped>
.contact-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 20px;
  font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Oxygen, Ubuntu, Cantarell, 'Open Sans', 'Helvetica Neue', sans-serif; /* iOS-like font */
  min-height: calc(100vh - 60px); /* Adjust based on SiteNav height */
  justify-content: center;
}

.profile-img {
  width: 150px;
  height: 150px;
  border-radius: 50%;
  object-fit: cover;
  margin-bottom: 20px;
  box-shadow: 0 4px 8px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

h1 {
  margin-bottom: 5px;
  color: #333;
}

p {
  margin-bottom: 20px;
  color: #666;
  font-size: 1.1em;
}

.social-links {
  display: flex;
  gap: 20px;
  margin-bottom: 10px; /* Reduced margin */
}

.social-links img {
  width: 40px;
  height: 40px;
  transition: transform 0.2s ease-in-out;
}

.social-links img:hover {
  transform: scale(1.1);
}

.cv-button {
  cursor: pointer;
  margin-top: 10px; /* Added margin to bring it closer */
  /* Adjust Lottie size if needed */
}
</style>

<style scoped>
.contact-info {
  margin-top: 15px;
  margin-bottom: 20px;
  text-align: center;
  color: #555;
  font-size: 1em;
}

.contact-info p {
  margin: 5px 0;
}
</style>

<style scoped>
.site-nav .nuxt-link-active {
  font-weight: normal !important;
  font-variation-settings: 'wght' 400 !important;
  /* Add other potential font-related overrides if needed */
}
</style>