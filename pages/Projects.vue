<template>
  <div class="page-wrapper">
    <Transition @enter="onParticlesEnter">
      <div v-if="hasWon" class="particles-background">
        <NuxtParticles
          id="tsparticles"
          :options="particleOptions"
          @load="onLoad"
        />
      </div>
    </Transition>

    <div class="content-container">
      <Transition
        :css="false"
        @leave="onGameLeave"
        @enter="onGameEnter"
        mode="out-in"
      >
        <div v-if="!hasWon" key="tictactoe" class="tic-tac-toe-wrapper">
          <h2>Victory unlocks my project archive.</h2>
          <TicTacToeGame @win="handleWin" />
        </div>

        <div v-else key="projects" class="projects-view" :class="{ 'detail-active-mobile': isMobileDetailActive }">
          <div ref="projectsListContainer" class="projects-list-container">
            <div class="projects-list">
              <Card
                v-for="(project, i) in projects"
                :key="project.title"
                v-bind="project"
                @view-details="showProjectDetails(project, i)"
                class="project-card"
                :class="{ 'selected': i === selectedIndex }"
                :is-selected="i === selectedIndex"
                :ref="el => projectCardRefs[i] = el" />
            </div>
          </div>

          <Teleport to="body" :disabled="!isMobile">
             <Transition :css="false" @enter="onDetailEnter" @leave="onDetailLeave">
                 <ProjectDetail
                    v-if="selectedProject"
                    ref="projectDetailRef"
                    :project="selectedProject"
                    @close="hideProjectDetails"
                    class="project-detail-component"
                    :class="{ 'is-mobile': isMobile }"
                 />
             </Transition>
          </Teleport>

        </div>
      </Transition>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue';
import type { Container, IOptions, RecursivePartial } from '@tsparticles/engine';
import { loadFull } from 'tsparticles';
import { gsap } from 'gsap';

// Assume components are registered/imported

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth'
  });
};
// import TicTacToeGame from './TicTacToeGame.vue';
// import Card from './Card.vue';
// import ProjectDetail from './ProjectDetail.vue';

// --- State ---
const hasWon = ref(false);
const selectedProject = ref<Project | null>(null);
const selectedIndex = ref<number | null>(null); // Index of the selected card
const isAnimating = ref(false); // Prevent double clicks during transition
const isSwitchingProjects = ref(false); // Flag to indicate if we are switching between projects
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0); // Track window width

// --- DOM Refs for GSAP ---
const projectsListContainer = ref<HTMLElement | null>(null);
const projectDetailRef = ref<{ $el: HTMLElement } | null>(null);
const projectCardRefs = ref<any[]>([]); // Array to hold refs to each Card component instance
const scrollPosition = ref(0); // Store scroll position



// --- Computed Properties ---
const isMobile = computed(() => windowWidth.value <= 900); // Mobile breakpoint
const isMobileDetailActive = computed(() => isMobile.value && !!selectedProject.value);

// --- Lifecycle Hooks ---
const updateWidth = () => {
  if (typeof window !== 'undefined') {
    windowWidth.value = window.innerWidth;
  }
};

onMounted(() => {
  updateWidth(); // Initial check
  window.addEventListener('resize', updateWidth);
  projectCardRefs.value = []; // Initialize refs array
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth);
});

// --- tsParticles ---
const particleOptions: RecursivePartial<IOptions> = { /* ... keep your options ... */
    fullScreen: { enable: true, zIndex: -1 }, background: { color: { value: '#ffffff' } }, particles: { number: { value: 120 }, color: { value: '#BD93FF' }, opacity: { value: 0.6 }, size: { value: { min: 1, max: 3 } }, move: { enable: true, speed: 0.8, direction: 'none', random: true, straight: false, outModes: 'out' }, links: { enable: true, distance: 180, color: '#BD93FF', opacity: 0.25, width: 1 } }, interactivity: { events: { onHover: { enable: true, mode: 'grab' }, resize: { enable: true } }, modes: { grab: { distance: 150, links: { opacity: 0.5 } } } }, detectRetina: true, responsive: [ { maxWidth: 768, options: { particles: { number: { value: 50 }, links: { distance: 120, opacity: 0.3 } }, interactivity: { modes: { grab: { distance: 100 } } } } } ]
 };
const onLoad = (container: Container) => { console.log('Particles container loaded:', container.id); };

// --- Project Data ---
import { projects, type Project } from '~/data/projects';

// --- Event Handlers ---
const handleWin = () => { hasWon.value = true; };

const showProjectDetails = async (project: Project, index: number) => {
  if (isAnimating.value) return; // Prevent if already animating

  if (selectedProject.value && selectedProject.value !== project) {
    // If a different project is already selected, close it first
    isSwitchingProjects.value = true; // Set flag
    await hideProjectDetails();
    // Wait for the close animation to complete before opening the new one
    await new Promise(resolve => setTimeout(resolve, 400)); // Adjust timeout based on your leave animation duration
  } else if (selectedProject.value === project) {
      // If the same project is clicked, do nothing
      return;
  }

  isAnimating.value = true;
  selectedProject.value = project;
  selectedIndex.value = index; // Store selected index for highlighting

  // Store current scroll position before opening detail
  if (window.scrollY > 0) {
    scrollPosition.value = window.scrollY;
  } else {
    scrollPosition.value = 0; // Ensure it's 0 if already at the top
  }


  // Scroll to top when viewing details
  if (!isMobile.value && scrollPosition.value > 0) {
    scrollToTop();
  }

  await nextTick(); // Wait for ProjectDetail to render (even if teleported)

  // The detail animation is now handled by the <Transition> hooks (onDetailEnter)
  // We only need to handle the list animation here

  const listEl = projectsListContainer.value;
  if (!listEl) {
      isAnimating.value = false;
      return;
  }

  if (isMobile.value) {
    // Mobile: Fade out list (detail fades/slides in via Transition)
    gsap.to(listEl, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      onComplete: () => { isAnimating.value = false; } // Reset flag after list fades
    });
  } else {
    // Desktop: Animate list translation + fade selected card
    const listShiftAmount = (projectDetailRef.value?.$el.offsetWidth ?? (windowWidth.value * 0.5)) * 0.5 + 32; // Approx half detail width + gap

    if (!isSwitchingProjects.value) {
        // Only animate list if not switching projects
        gsap.timeline({ onComplete: () => { isAnimating.value = false; } })
          .to(listEl, {
            x: -listShiftAmount, // Move list left by half the detail width + gap
            //width: '50%', // Keep width 100%, just translate
            opacity: 0.9, // Slightly fade list
            duration: 0.6,
            ease: 'power3.inOut'
          });
           // No need to animate selected card out, just use .selected style
    } else {
        isAnimating.value = false; // Reset flag immediately if switching
    }
  }
  isSwitchingProjects.value = false; // Reset flag after animation logic
};

const hideProjectDetails = async () => {
  if (isAnimating.value || !selectedProject.value) return;
  isAnimating.value = true;

  // Trigger the detail leave animation (handled by onDetailLeave)
  selectedProject.value = null; // Setting this to null triggers the v-if and Transition leave

  // List animation happens after detail leave animation finishes (in onDetailLeave hook)
  // Reset selected index immediately visually
   selectedIndex.value = null;
};

// --- Transition Hooks ---

const onGameLeave = (el: Element, done: () => void) => { gsap.to(el, { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in', onComplete: done }); };
const onGameEnter = (el: Element, done: () => void) => { gsap.from(el, { opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.out', delay: 0.1, onComplete: done }); };
const onParticlesEnter = (el: Element, done: () => void) => { gsap.from(el, { opacity: 0, duration: 1.5, ease: 'none', onComplete: done }); };

// --- Project Detail Transition Hooks ---
const onDetailEnter = (el: Element, done: () => void) => {
    // 'el' is the projectDetailRef.$el here
    if (isMobile.value) {
        // Mobile: Slide up from bottom and fade in
        gsap.fromTo(el,
            { y: '100vh', opacity: 0 },
            { y: '0%', opacity: 1, duration: 0.5, ease: 'power3.out', onComplete: done }
        );
    } else {
        // Desktop: Fade in (already positioned absolutely)
         gsap.fromTo(el,
            { opacity: 0, scale: 0.98 }, // Start slightly smaller
            { opacity: 1, scale: 1, duration: 0.4, ease: 'power2.out', delay: 0.1, onComplete: done } // Delay slightly
        );
    }
};

const onDetailLeave = (el: Element, done: () => void) => {
    const listEl = projectsListContainer.value;

    const onLeaveComplete = () => {
        // This runs AFTER detail is visually gone
        selectedIndex.value = null; // Ensure index is cleared
        isAnimating.value = false; // Allow new animations

        // Animate list back ONLY if not switching projects
        if (listEl && !isSwitchingProjects.value) {
             if (isMobile.value) {
                 // Mobile: Fade list back in
                 gsap.to(listEl, { opacity: 1, duration: 0.4, ease: 'power2.in' });
             } else {
                // Desktop: Translate list back
                 gsap.to(listEl, {
                     x: 0,
                     opacity: 1,
                     duration: 0.5,
                     ease: 'power3.out'
                 });
             }
        }

        // Scroll back to the previous position if not on mobile and a position was stored
        if (!isMobile.value && scrollPosition.value > 0) {
            window.scrollTo({
                top: scrollPosition.value,
                behavior: 'smooth'
            });
            scrollPosition.value = 0; // Reset stored position
        }

        done(); // Signal Vue transition is complete
    };

    if (isMobile.value) {
        // Mobile: Slide down and fade out
        gsap.to(el, { y: '100vh', opacity: 0, duration: 0.4, ease: 'power3.in', onComplete: onLeaveComplete });
    } else {
        // Desktop: Fade out
        gsap.to(el, { opacity: 0, scale: 0.98, duration: 0.3, ease: 'power2.in', onComplete: onLeaveComplete });
    }
};


// --- Watchers ---
watch(hasWon, async (newValue) => {
  if (newValue) {
    await nextTick();
     if (projectsListContainer.value) {
        const cards = projectsListContainer.value.querySelectorAll('.project-card');
        gsap.set(projectsListContainer.value, { opacity: 1, x: 0 }); // Ensure initial state
        gsap.from(cards, {
            opacity: 0, y: 30, duration: 0.5, stagger: 0.1,
            ease: 'power2.out', delay: 0.3
        });
     }
  }
});

// Watch for selectedProject changes to potentially add/remove body class for scroll lock on mobile
watch(isMobileDetailActive, (isActive) => {
    if (typeof document !== 'undefined') {
        if (isActive) {
            document.body.style.overflow = 'hidden'; // Prevent body scroll when mobile detail is open
        } else {
            document.body.style.overflow = ''; // Restore body scroll
        }
    }
});


</script>

<style scoped>
.page-wrapper {
  position: relative;
  min-height: 100vh;
  width: 100%;
  overflow-x: hidden;
}

.particles-background {
  position: absolute; top: 0; left: 0; width: 100%; height: 100%; z-index: -1; opacity: 0;
}

.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  position: relative; z-index: 1;
}

.tic-tac-toe-wrapper {
  text-align: center; background-color: rgba(255, 255, 255, 0.85);
  padding: 2rem 3rem; border-radius: 12px; box-shadow: 0 5px 20px rgba(0,0,0,0.12);
}
.tic-tac-toe-wrapper h2 { margin-bottom: 1.5rem; color: #333; font-weight: 600; }

/* Projects View Area */
.projects-view {
  display: flex;
  align-items: flex-start;
  width: 100%;
  max-width: 1200px;
  position: relative; /* Crucial for absolute positioning of desktop detail */
  /* Prevent parent height jump by ensuring it doesn't collapse based on list width */
   min-height: 50vh; /* Or set dynamically based on initial list height */
}

/* List Container */
.projects-list-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease; /* Smooth transition for transform */
  /* GSAP controls transform/opacity directly */
}

.projects-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 1rem 0;
  align-content: flex-start; /* Prevent vertical jump when wrapping */
}

/* --- Card Highlighting --- */
.project-card {
    transition: transform 0.3s ease, opacity 0.3s ease, border-color 0.3s ease;
    border: 2px solid transparent; /* Placeholder for border */
}

.project-card.selected {
    /* Styles for the selected card in the list */
    border-color: #4f46e5;
    opacity: 0.6; /* Fade it slightly */
    transform: scale(0.97); /* Slightly shrink */
    box-shadow: none; /* Optional: remove hover shadow */
}


/* --- Detail Component Styling --- */
/* Common styles first */
:global(.project-detail-component) { /* Use :global because it might be teleported */
    box-sizing: border-box;
    z-index: 10; /* Ensure it's above the list */
    /* Base opacity/transform set by GSAP */
}

/* Desktop specific styles for Detail */
:global(.project-detail-component:not(.is-mobile)) {
    position: absolute;
    right: 0;
    top: 0;
    width: 55%; /* Detail width */
    height: 100%; /* Match list container height potentially? Or use max-height */
    max-height: 80vh; /* Limit height and allow scrolling */
    overflow-y: auto; /* Enable scrolling within detail */
    padding: 2rem; /* Add padding */
    background-color: #f9fafb; /* Ensure background */
    border-radius: 8px;
    box-shadow: -5px 0px 15px rgba(0,0,0,0.1); /* Shadow on the left */
}

/* Mobile specific styles for Detail */
:global(.project-detail-component.is-mobile) {
    position: fixed; /* Fullscreen fixed position */
    top: 0;
    left: 0;
    width: 100%;
    height: 100vh; /* Full viewport height */
    height: 100dvh; /* Dynamic viewport height */
    background-color: #fff; /* Solid background */
    overflow-y: auto; /* Scrollable content */
    padding: 1.5rem;
    padding-bottom: 5rem;
    z-index: 1000; /* High z-index */
    /* Back button needs specific styling within ProjectDetail.vue for fixed pos */
}


/* --- Responsive --- */
@media (max-width: 900px) {
    .projects-view {
        /* Mobile: No specific layout changes needed here anymore, */
        /* hiding list is handled by opacity animation + potentially display none if needed */
        min-height: initial; /* Reset min-height */
         align-items: center; /* Center list when detail is not shown */
    }

     /* Style to hide list container completely when mobile detail is active */
     /* Use opacity for fade, could use display: none triggered by isAnimating flag */
     /* .projects-view.detail-active-mobile .projects-list-container {
         display: none;
     } */

    /* Detail component styles are handled by .is-mobile class */
}
</style>