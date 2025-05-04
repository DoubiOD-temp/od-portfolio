<template>
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
        value: '#000000' // White particles for visibility
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
        color: '#000000', // Line color
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