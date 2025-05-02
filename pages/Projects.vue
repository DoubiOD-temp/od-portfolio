<script setup lang="ts">
import type { Container, IOptions, RecursivePartial } from '@tsparticles/engine'

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
      value: 200 // Number of particles on screen
    },
    color: {
      value: '#BD93FF' // White particles for visibility
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
      color: '#BD93FF', // Line color
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
const projects = [
  {
    title: "BRAGI",
    tag: "AI",
    description: "A cutting-edge AI-powered video generator that simplifies content creation with minimal input.",
    image: "/images/img.png", // Assuming a new image for BRAGI
    link: "#" // Replace with actual link
  },
  {
    title: "Subtruck AI",
    tag: "App Development",
    description: "An AI-driven app to manage subscriptions efficiently, helping users save money by tracking and optimizing their spending.",
    image: "/images/img.png", // Assuming a new image for Subtruck
    link: "#" // Replace with actual link
  },
  {
    title: "Redefine Progress/Skill 2 Sem2",
    tag: "Web Development",
    description: "A skill integration platform for students, offering easier training session journeys and progress tracking.",
    image: "/images/img.png", // Assuming a new image for Redefine Progress
    link: "#" // Replace with actual link
  },
  {
    title: "Help Students Enroll Easier",
    tag: "UI/UX Design",
    description: "A Figma-designed UI/UX prototype to simplify the student enrollment process with an intuitive and user-friendly interface.",
    image: "/images/img.png", // Assuming a new image for Help Students Enroll Easier
    link: "#" // Replace with actual link
  }
]
</script>

<template>
  <div class="projects-list">
    <Card
      v-for="(project, i) in projects"
      :key="i"
      v-bind="project"
    />
  </div>
  <div class="page-container">
      <NuxtParticles
        id="tsparticles"
        :options="particleOptions"
        @load="onLoad"
      ></NuxtParticles>
    </div>
</template>