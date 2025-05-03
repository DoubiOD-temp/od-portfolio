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
  <div class="page-container">
    <NuxtParticles
      id="tsparticles"
      :options="particleOptions"
      @load="onLoad"
    ></NuxtParticles>
  </div>
</template>

<script setup lang="ts">
import type { Container, IOptions, RecursivePartial } from '@tsparticles/engine'
import { ref, onMounted, onUnmounted } from 'vue';
import ButtonAnimation from '~/public/animations/Button.json';

const lottieAnimation = ref(null);

const downloadCV = () => {
  window.open('/CV/Ondrej_Dobis-CV-3_2025.pdf', '_blank');
};

const particleOptions: RecursivePartial<IOptions> = {
  fullScreen: {
    enable: true, // Makes particles cover the entire viewport
    zIndex: -1 // Places particles behind other content
  },
  background: {
    color: {
      value: '#ffffff' // Dark background for contrast
    }
  },
  particles: {
    number: {
      value: 150 // Number of particles on screen
    },
    color: {
      value: '#3C65BF' // White particles for visibility
    },
    size: {
      value: {
        min: 1, // Minimum size for randomization
        max: 4 // Maximum size for randomization
      },
    },
    move: {
      enable: true, // Enable movement
      speed: 1, // Slow floating speed
      direction: 'none', // No specific direction, random movement
      random: true, // Randomize movement paths
      straight: false // Non-linear paths for natural floating
    },
    links: {
      enable: true, // Draw lines between nearby particles
      distance: 300, // Maximum distance for connecting lines
      color: '#3C65BF', // Line color
      opacity: 0.3, // Line transparency
      width: 1 // Line thickness
    }
  },
  interactivity: {
    detectsOn: 'window', // Detect interactions on the canvas
    events: {
      onHover: {
        enable: true, // Enable hover interaction
        mode: 'grab' // Particles move away from cursor
        // Removed 'distance' and 'duration' from here as they belong to modes.repulse
      },
      resize: {
        enable: true // Adjust particles on window resize
      }
    },
    modes: {
      grab: { 
        distance: 200, // Distance particles are pushed away
        speed: 1 // Speed of repulsion (slow as requested)
      }
    }
  },
  responsive: [
  {
    maxWidth: 1024, // For screens smaller than 1024px (e.g., tablets)
    mode: 'canvas',
    options: {
      particles: {
        number: {
          value: 35 // Reduce number of particles
        },
        size: {
          value: 1 // Reduce size of particles
        },
        links: {
          distance: 200 // Reduce connection distance
        }
      }
    }
  },
  {
    maxWidth: 768, // For screens smaller than 768px (e.g., mobile)
    mode: 'screen',
    options: {
      particles: {
        number: {
          value: 40 // Further reduce number of particles
        },
        size: {
          value: 1.5 // Further reduce size of particles
        },
        links: {
          distance: 80 // Further reduce connection distance
        }
      }
    }
  }
]
}

const onLoad = (container: Container) => {
  console.log('Particles loaded', container)
}

</script>

<style scoped>

.contact-page-container {
  display: flex;
  flex-direction: column;
  align-items: center;
  padding: 70px 20px 20px; /* Top padding to prevent profile pic cutoff */
  padding-top: 72px; /* Added 50px of top padding (20px original + 50px extra) */
  padding-bottom: 0px;
  margin-bottom: 0px;
  min-height: calc(100vh - 60px);
  justify-content: center;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
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
  box-shadow: 0 8px 32px rgba(30, 41, 59, 0.13);
  border: 1px solid #e2e8f0;
  padding: 20px 30px; /* Reduced vertical padding from 30px to 20px */
  max-width: 700px;
  width: 100%;
  margin-bottom: 20px;
  justify-content: center;
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
  margin-bottom: 3px; /* Reduced from 5px */
  text-align: center;
}

.card-titles {
  margin-bottom: 15px;
  color: #555;
  font-size: 1em;
  line-height: 1.4;
  text-align: center;
  padding-bottom: 15px;
  border-bottom: 1px solid #eee; /* Adds a light horizontal line */
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
  margin: 3px 0; /* Reduced from 5px */
}

.buttons-container {
  display: flex;
  flex-direction: column;
  align-items: center; /* Ensures horizontal centering */
  justify-content: center; /* Helps with vertical alignment */
  width: 100%; /* Take full width of parent */
  gap: 20px; /* Consistent spacing between elements */
}

.social-links {
  display: flex;
  justify-content: center; /* Center the social icons horizontally */
  gap: 15px;
  width: 100%; /* Take full width to center properly */
}

.social-links a {
  display: block; /* Ensure each link is a block element */
  position: relative; /* Create stacking context */
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
  height: auto;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
  margin-top: -80px; /* Added negative margin to bring it closer to social links */
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
