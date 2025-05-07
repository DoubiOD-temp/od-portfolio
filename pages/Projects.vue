<template>
  <div class="page-wrapper">
    <div class="content-container">
      <Transition :css="false" @leave="onGameLeave" @enter="onGameEnter" mode="out-in">
        <div v-if="!hasWon" key="tictactoe" class="tic-tac-toe-wrapper">
          <div class="portfolio-intro-text">
            This
            <a
              href="https://github.com/DoubiOD-temp/od-portfolio"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="View Portfolio Source Code on GitHub"
            >
              <span class="highlight">portfolio</span>
              <NuxtImg src="/images/github.png" alt="GitHub Icon" class="github-icon-inline" />
            </a>
            was made from scratch with <b>Nuxt.js</b>, <b>GSAP</b> and other tools.
          </div>

          <h2>Want to see more? Win the game first!</h2>
          <TicTacToeGame @win="handleWin" />
        </div>

        <div v-else key="projects" class="projects-view" :class="{ 'detail-active-mobile': isMobileDetailActive }">
          <div class="projects-header">
            <h2 class="section-heading">Project history</h2>
            <span class="info-icon" @click="showInfoTooltip = !showInfoTooltip" aria-label="Information about project ownership">
              i
            </span>

            <Transition name="fade">
              <div v-if="showInfoTooltip" class="info-tooltip">
                Although my primary expertise is in backend development, I do not claim individual ownership over any
                specific part of <b>collaborative projects</b>. Each of them was developed under a model of collective
                code ownership, with all team members contributing to and sharing responsibility for the codebase.
              </div>
            </Transition>
          </div>
          <div ref="projectsListContainer" class="projects-list-container">
            <div class="projects-list">
              <Card
                v-for="(project, i) in projects"
                :key="project.title"
                v-bind="project"
                @view-details="showProjectDetails(project, i)"
                class="project-card"
                :class="{ selected: i === selectedIndex }"
                :is-selected="i === selectedIndex"
                :ref="(el) => (projectCardRefs[i] = el)"
              />
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
import { gsap } from 'gsap';
import { useEventListener } from '@vueuse/core'; // Using @vueuse/core for click outside

// Assume components are registered/imported
// import TicTacToeGame from './TicTacToeGame.vue';
// import Card from './Card.vue';
// import ProjectDetail from './ProjectDetail.vue';

const scrollToTop = () => {
  window.scrollTo({
    top: 0,
    behavior: 'smooth',
  });
};

// --- State ---
const hasWon = ref(false);
const selectedProject = ref<Project | null>(null);
const selectedIndex = ref<number | null>(null); // Index of the selected card
const isAnimating = ref(false); // Prevent double clicks during transition
const isSwitchingProjects = ref(false); // Flag to indicate if we are switching between projects
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0); // Track window width
const showInfoTooltip = ref(false); // State for the info tooltip visibility

// --- DOM Refs for GSAP and Tooltip ---
const projectsListContainer = ref<HTMLElement | null>(null);
const projectDetailRef = ref<{ $el: HTMLElement } | null>(null);
const projectCardRefs = ref<any[]>([]); // Array to hold refs to each Card component instance
const scrollPosition = ref(0); // Store scroll position
const infoTooltipRef = ref<HTMLElement | null>(null); // Ref for the tooltip element

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

  // Close tooltip when clicking anywhere else on the document
  useEventListener(document, 'click', (event) => {
    const iconElement = document.querySelector('.info-icon'); // Get the icon element
    // If click is outside the icon AND the tooltip, close the tooltip
    if (
      showInfoTooltip.value &&
      iconElement &&
      !iconElement.contains(event.target as Node) &&
      (!infoTooltipRef.value || !infoTooltipRef.value.contains(event.target as Node))
    ) {
      showInfoTooltip.value = false;
    }
  });

  // Close tooltip on scroll to prevent awkward positioning
  useEventListener(
    window,
    'scroll',
    () => {
      if (showInfoTooltip.value) {
        showInfoTooltip.value = false;
      }
    },
    { passive: true }
  ); // Use passive for scroll events
});

onBeforeUnmount(() => {
  window.removeEventListener('resize', updateWidth);
});


// --- Project Data ---
import { projects, type Project } from '~/data/projects';

// --- Event Handlers ---
const handleWin = () => {
  hasWon.value = true;
};

const showProjectDetails = async (project: Project, index: number) => {
  if (isAnimating.value) return; // Prevent if already animating

  // Always store current scroll position before opening detail
  scrollPosition.value = window.scrollY;

  // Scroll to top immediately for desktop, before any potential awaiting or rendering
  if (!isMobile.value) {
    scrollToTop();
  }

  if (selectedProject.value && selectedProject.value !== project) {
    // If a different project is already selected, close it first
    isSwitchingProjects.value = true; // Set flag
    await hideProjectDetails(); // Wait for the old detail to hide
  } else if (selectedProject.value === project) {
    // If the same project is clicked, do nothing
    return;
  }

  isAnimating.value = true; // Start animating *before* setting the new project
  selectedProject.value = project;
  selectedIndex.value = index; // Store selected index for highlighting

  await nextTick(); // Wait for ProjectDetail to render (even if teleported)

  // The detail animation is now handled by the <Transition> hooks (onDetailEnter)
  // We only need to handle the list animation here

  const listEl = projectsListContainer.value;
  if (!listEl) {
    // If no list element, the animation might complete faster,
    // isAnimating reset is handled in onDetailEnter
    return;
  }

  if (isMobile.value) {
    // Mobile: Fade out list (detail fades/slides in via Transition)
    gsap.to(listEl, {
      opacity: 0,
      duration: 0.3,
      ease: 'power2.out',
      // isAnimating reset is handled in onDetailEnter
    });
  } else {
    // Desktop: Animate list translation + fade selected card
    const listShiftAmount = (projectDetailRef.value?.$el.offsetWidth ?? windowWidth.value * 0.5) * 0.63 + 32; // Approx half detail width + gap

    // Always animate list translation on desktop when opening
    gsap.timeline({
      // isAnimating reset is handled in onDetailEnter
    }).to(listEl, {
      x: -listShiftAmount, // Move list left by half the detail width + gap
      opacity: 0.9, // Slightly fade list
      duration: 0.6,
      ease: 'power3.inOut',
    });
    // No need to animate selected card out, just use .selected style
  }
  // isSwitchingProjects is reset in onDetailLeave complete of the old detail
};

const hideProjectDetails = async () => {
  if (isAnimating.value && !isSwitchingProjects.value) return; // Prevent if already animating, unless switching
  // No need to check !selectedProject.value here, setting it to null handles the v-if

  // Trigger the detail leave animation (handled by onDetailLeave)
  selectedProject.value = null; // Setting this to null triggers the v-if and Transition leave
  showInfoTooltip.value = false; // Hide tooltip when closing details

  // The rest of the logic happens in onDetailLeave's onLeaveComplete
};

// --- Transition Hooks ---

const onGameLeave = (el: Element, done: () => void) => {
  gsap.to(el, { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in', onComplete: done });
};
const onGameEnter = (el: Element, done: () => void) => {
  gsap.from(el, { opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.out', delay: 0.1, onComplete: done });
};

// --- Project Detail Transition Hooks ---
const onDetailEnter = (el: Element, done: () => void) => {
  // 'el' is the projectDetailRef.$el here
  if (isMobile.value) {
    // Mobile: Slide up from bottom and fade in
    gsap.fromTo(
      el,
      { y: '100vh', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.5,
        ease: 'power3.out',
        onComplete: () => {
          isAnimating.value = false;
          done();
        },
      } // Reset isAnimating here
    );
  } else {
    // Desktop: Fade in (already positioned absolutely)
    gsap.fromTo(
      el,
      { opacity: 0, scale: 0.98 }, // Start slightly smaller
      {
        opacity: 1,
        scale: 1,
        duration: 0.4,
        ease: 'power2.out',
        delay: 0.1,
        onComplete: () => {
          isAnimating.value = false;
          done();
        },
      } // Delay slightly, reset isAnimating here
    );
  }
};

const onDetailLeave = (el: Element, done: () => void) => {
  const listEl = projectsListContainer.value;

  const onLeaveComplete = () => {
    // This runs AFTER detail is visually gone
    // Only restore scroll position and reset state if NOT switching projects
    if (!isSwitchingProjects.value) {
      selectedIndex.value = null; // Ensure index is cleared
      isAnimating.value = false; // Allow new animations

      // Animate list back
      if (listEl) {
        if (isMobile.value) {
          gsap.to(listEl, { opacity: 1, duration: 0.3, ease: 'power2.in' });
        } else {
          gsap.to(listEl, {
            x: 0,
            opacity: 1,
            duration: 0.5,
            ease: 'power3.out',
          });
        }
      }

      // Restore scroll position
      if (!isMobile.value && scrollPosition.value > 0) {
        window.scrollTo({
          top: scrollPosition.value,
          behavior: 'smooth',
        });
        scrollPosition.value = 0; // Reset stored position
      }
    }
    // Always reset isSwitchingProjects after the old detail's leave transition finishes
    isSwitchingProjects.value = false;
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
        opacity: 0,
        y: 30,
        duration: 0.5,
        stagger: 0.1,
        ease: 'power2.out',
        delay: 0.3,
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

.content-container {
  display: flex;
  justify-content: center;
  align-items: center;
  min-height: 100vh;
  padding: 2rem;
  box-sizing: border-box;
  position: relative;
  z-index: 1;
}

/* Style for the introductory text block */
.portfolio-intro-text {
  max-width: 450px; /* Set a max width for the text */
  margin: 0 auto 1.5rem auto; /* Center the block and add space below */
  text-align: center; /* Center the text */
  font-size: 1.1rem;
  line-height: 1.6;
  color: #333;
}

/* Style for the embedded link within the text */
.portfolio-intro-text a {
  color: #4d63bb; /* Set link color */
  text-decoration: underline; /* Add underline */
  font-weight: 500; /* Match the link style */
  transition: color 0.2s ease;
  display: inline-flex; /* Allow icon to sit nicely next to text */
  align-items: baseline; /* Align text baseline */
  gap: 0.2rem; /* Small gap between "portfolio" span and icon */
}

.portfolio-intro-text a:hover {
  color: #3a4c9b; /* Darker shade on hover */
  /* text-decoration: underline; /* Underline is always present now */
}

/* Style to highlight the word "portfolio" */
.portfolio-intro-text a .highlight {
  color: #4d63bb; /* Ensure highlight color */
  font-weight: 600; /* Make it bold */
}

/* Style for the embedded GitHub icon */
.github-icon-inline {
  width: 1.2em; /* Slightly larger size */
  height: 1.2em; /* Slightly larger size */
  object-fit: contain;
  vertical-align: -0.2em; /* Adjust vertical alignment */
  margin-left: 0.1em; /* Small space before the icon */
}

/* Ensure the main tic-tac-toe-wrapper still has its base styles */
.tic-tac-toe-wrapper {
  text-align: center;
  background-color: rgba(255, 255, 255, 0.85);
  padding: 2rem 3rem;
  border-radius: 12px;
  box-shadow: 0 5px 20px rgba(0, 0, 0, 0.12);
  max-width: none; /* Ensure this is still present */
  /* You might need to add margin-top/bottom here or to its parent */
  margin-top: auto; /* Example: push it to the bottom if in a flex container */
  margin-bottom: auto; /* Example: center it vertically */
}

.tic-tac-toe-wrapper h2 {
  margin-bottom: 1.5rem;
  color: #333;
  font-weight: 600;
}

/* Projects View Area */
.projects-view {
  display: flex;
  flex-direction: column; /* Stack header, list, and detail vertically */
  align-items: center; /* Center children horizontally */
  width: 100%;
  max-width: 1200px;
  position: relative; /* Crucial for absolute positioning of tooltip and desktop detail */
  min-height: 50vh; /* Ensure it has some height */
}

/* === Project History Header Area (Heading + Icon) === */
.projects-header {
  display: flex;
  justify-content: center; /* Center heading and icon block */
  align-items: center; /* Vertically align heading text and icon */
  gap: 0.8rem; /* Space between heading and icon */
  width: 100%; /* Take full width to allow centering */
  margin-top: 3rem; /* Matches section-heading margin-top */
  /* margin-bottom: 3rem; Matches section-heading margin-bottom */
  position: relative; /* Needed for tooltip absolute positioning if relative to this */
}

/* --- Section Heading Style (from user) --- */
.section-heading {
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
  font-size: 2.8rem;
  font-weight: 700;
  color: #2d3748;
  text-align: center; /* Still good practice though flex handles centering */
  margin: 0; /* Remove margins from h2 itself as parent flex handles spacing */
  letter-spacing: -0.02em;
}

/* --- Info Icon Style --- */
.info-icon {
  display: inline-flex;
  justify-content: center;
  align-items: center;
  width: 1rem; /* Reduced size (2/3 of 1.5rem) */
  height: 1rem; /* Reduced size (2/3 of 1.5rem) */
  border-radius: 50%;
  background-color: transparent;
  border: 1.8px solid #2d3748; /* Adjusted border thickness */
  color: #2d3748;
  font-size: 0.6rem; /* Adjusted font size (2/3 of 0.9rem) */
  font-weight: bold;
  cursor: pointer;
  flex-shrink: 0;
  transition: all 0.2s ease;
}

.info-icon:hover {
  background-color: rgba(77, 99, 187, 0.1);
  color: #3a4c9b;
  border-color: #3a4c9b;
}

/* === Information Tooltip Style === */
.info-tooltip {
  position: absolute;
  top: calc(100% + 10px); /* Position below the header div + gap */
  left: 50%; /* Start at the middle horizontally */
  transform: translateX(-50%); /* Shift left by half its width to truly center */
  width: 90%; /* Take up most of the width on mobile */
  max-width: 400px; /* Max width on larger screens */
  background-color: #333; /* Dark background */
  color: white;
  padding: 1rem;
  border-radius: 8px;
  box-shadow: 0 4px 15px rgba(0, 0, 0, 0.2);
  z-index: 100; /* Ensure it's above other content */
  font-size: 0.9rem;
  line-height: 1.5;
  text-align: left; /* Align text left inside tooltip */
  pointer-events: none; /* Allows clicks to pass through to elements below when not interacting with the tooltip itself */
  opacity: 1; /* Controlled by transition */
}

/* --- Fade Transition for Tooltip --- */
.fade-enter-active,
.fade-leave-active {
  transition: opacity 0.3s ease;
}
.fade-enter-from,
.fade-leave-to {
  opacity: 0;
}

/* List Container */
.projects-list-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  transition: transform 0.6s cubic-bezier(0.25, 0.8, 0.25, 1), opacity 0.6s ease;
}

.projects-list {
  display: flex;
  flex-wrap: wrap;
  justify-content: center;
  gap: 1.5rem;
  padding: 0;
  align-content: center;
}

/* --- Card Highlighting --- */
.project-card {
  transition: transform 0.3s ease, opacity 0.3s ease, border-color 0.3s ease;
  border: 2px solid transparent;
}

.project-card.selected {
  border-color: #4f46e5;
  opacity: 0.6;
  transform: scale(0.97);
  box-shadow: none;
}

/* --- Detail Component Styling --- */
:global(.project-detail-component) {
  box-sizing: border-box;
  z-index: 10;
}

:global(.project-detail-component:not(.is-mobile)) {
  position: absolute;
  right: 0;
  top: 0;
  width: 55%;
  height: 100%;
  margin-top: 8.6rem;
  max-height: 80vh;
  overflow-y: auto;
  padding: 2rem;
  border-radius: 8px;
  box-shadow: -5px 0px 25px rgba(0, 0, 0, 0.1);
}

:global(.project-detail-component.is-mobile) {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  height: 100vh;
  height: 100dvh;
  background-color: #fff;
  overflow-y: auto;
  padding: 1.5rem;
  padding-bottom: 5rem;
  z-index: 1000;
}
@media (min-width: 900px) {
  h2 {
    margin-top: 30px;
  }
}

/* --- Responsive --- */
@media (max-width: 900px) {
  .projects-view {
    min-height: initial;
    align-items: center;
  }

  .projects-header {
    margin-top: 0rem;
    margin-bottom: 0rem; 
    gap: 0.5rem; 
  }

  .section-heading {
    font-size: 2rem; 
    margin-bottom: 0;
  }

  .info-icon {
    margin-left: 0.6;
    margin-top: 2.2rem;
  }

  .info-tooltip {
    top: calc(100% + 5px);
  }

  .project-list {
    padding-top: 0rem !important;
  }

  section,
  .projects-list,
  .contact-page-container,
  div > .timeline-outer:first-child,
  div > h2.section-heading:first-child {
    padding-top: 25px !important;
    margin-top: 15px !important; /* margin-top: 10px !important; */
  }
}
</style>