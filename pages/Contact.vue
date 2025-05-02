<template>
  <div class="contact-page-container">
    <div class="profile-img-container">
      <img src="/images/profile.png" alt="Profile Picture" class="profile-img">
    </div>
    <div class="business-card-wrapper">
      <div class="card-content">
        <h1 class="card-name">Ondrej Dobiš</h1>
        <div class="card-titles">
          <p>Applied computer science student</p>
          <p>Software developer ext.</p>
        </div>
        <div class="card-contact-info">
          <p>Geel, Belgium</p>
          <p>+421 910 111 092 / +32 477 42 02 28</p>
          <p>dobisondrej@gmail.com</p>
        </div>
      </div>
    </div>

    <div class="buttons-container">
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
          :height="250"
          :width="250"
          :loop="false"
          :delay="400"
          @click="downloadCV"
        />
      </div>
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

</script>

<style scoped>

.contact-page-container {
  display: flex;
  flex-direction: column; /* Stack card and buttons vertically */
  align-items: center;
  padding: 20px;
  min-height: calc(100vh - 60px); /* Adjust based on SiteNav height */
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif; /* Consistent font */
}

.contact-page-container {
  display: flex;
  flex-direction: column; /* Stack elements vertically */
  align-items: center;
  padding: 20px;
  min-height: calc(100vh - 60px); /* Adjust based on SiteNav height */
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif; /* Consistent font */
}

.profile-img-container {
  width: 120px; /* Container size for circular image */
  height: 120px;
  border-radius: 50%;
  overflow: hidden;
  margin-bottom: 30px; /* Space between image and card */
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1); /* Subtle shadow */
}

.profile-img {
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.business-card-wrapper {
  display: flex;
  background: #fff;
  border-radius: 18px;
  box-shadow: 0 8px 32px rgba(30, 41, 59, 0.13); /* Similar shadow to timeline cards */
  border: 1px solid #e2e8f0; /* Similar border to timeline cards */
  padding: 30px; /* Adjust padding as needed */
  max-width: 700px; /* Max width for the business card */
  width: 100%;
  margin-bottom: 30px; /* Space between card and buttons */
  justify-content: center; /* Center content horizontally */
}

.card-content {
  display: flex;
  flex-direction: column;
  align-items: center; /* Center text content */
}

.card-name {
  font-size: 1.8rem;
  font-weight: 700;
  color: #333;
  margin-bottom: 5px;
  text-align: center;
}

.card-titles {
  margin-bottom: 10px; /* Reduced margin */
  color: #555;
  font-size: 1em;
  line-height: 1.4; /* Improved line spacing */
  text-align: center;
}

.card-titles p {
  margin: 0;
}

.card-contact-info {
  color: #555;
  font-size: 1em;
  line-height: 1.4; /* Improved line spacing */
  text-align: center;
}

.card-contact-info p {
  margin: 5px 0;
}

.buttons-container {
  display: flex;
  flex-direction: column; /* Stack social links and CV button vertically */
  align-items: center;
  gap: 30px; /* Increased space to match the 30px margin-bottom of business-card-wrapper */
  margin-bottom: 30px; /* Added bottom margin to match other spacing */
}

.social-links {
  display: flex;
  gap: 15px; /* Space between social icons */
}

.social-links img {
  width: 50px; /* Size of social icons */
  height: 50px;
  transition: transform 0.2s ease-in-out;
}

.social-links img:hover {
  transform: scale(1.1);
}

.cv-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.cv-button:hover {
  transform: translateY(-3px);
}

/* Fix for SVG height issue */
.cv-button svg {
  height: 0% !important;
}

.cv-button-text {
  font-size: 0.9rem;
  color: #333;
  margin-top: -15px; /* Adjust spacing */
}


/* Responsive adjustments */
@media (max-width: 600px) {
  .business-card-wrapper {
    padding: 20px;
  }

  .card-name {
    font-size: 1.5rem;
  }

  .card-titles,
  .card-contact-info {
    font-size: 1em;
  }
}

</style>
