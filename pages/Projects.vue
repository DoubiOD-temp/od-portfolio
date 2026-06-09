<template>
  <div class="page-wrapper">
    <div
      class="content-container"
      :class="{ 'projects-detail-open': !isMobile && selectedProject }"
    >
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="currentColor" class="github-icon-inline" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
              </svg>
            </a>
            was made from scratch with <b>Nuxt.js</b>, <b>GSAP</b> and other tools.
          </div>

          <h2>Want to see more? Win the game first!</h2>
          <TicTacToeGame @win="handleWin" />
        </div>

        <div
          v-else
          ref="projectsView"
          key="projects"
          class="projects-view"
          :class="{
            'detail-active-mobile': isMobileDetailActive,
            'detail-active-desktop': !isMobile && selectedProject,
          }"
        >
          <div class="projects-content" :class="{ 'has-detail': selectedProject }">
            <div ref="projectsLeftColumn" class="projects-left-column">
              <div class="projects-header">
                <h2 class="section-heading">Project history</h2>
                <span class="info-icon" @click="showInfoTooltip = !showInfoTooltip" aria-label="Information about project ownership">
                  i
                </span>

                <Transition name="fade">
                  <div v-if="showInfoTooltip" class="info-tooltip">
                    I do not claim individual ownership over any specific part of <b>collaborative projects</b>. Each of them was developed under a model of collective
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
            </div>

            <Teleport to="body" :disabled="!isMobile">
              <Transition :css="false" @enter="onDetailEnter" @leave="onDetailLeave">
                <ProjectDetail
                  v-if="selectedProject"
                  :project="selectedProject"
                  :is-mobile="isMobile"
                  @close="hideProjectDetails"
                  class="project-detail-component"
                  :class="{ 'is-mobile': isMobile }"
                />
              </Transition>
            </Teleport>
          </div>
        </div>
      </Transition>
    </div>

    <div
      v-if="isEntryFadeMounted"
      class="projects-entry-fade"
      :class="{ 'is-visible': isEntryFadeVisible }"
      aria-hidden="true"
    />
  </div>
</template>

<script setup lang="ts">
import { ref, watch, nextTick, onMounted, onBeforeUnmount, computed } from 'vue';
import { gsap } from 'gsap';
import { useEventListener } from '@vueuse/core'; // Using @vueuse/core for click outside

if (import.meta.client) {
  gsap.defaults({ overwrite: 'auto', ease: 'power2.out' });
  gsap.ticker.lagSmoothing(0);
}

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const projectsEntryFadeKey = 'od-projects-entry-fade';
const projectsEntryFadeDuration = 100;

const shouldPlayProjectsEntryFade = () => {
  if (typeof window === 'undefined' || prefersReducedMotion()) {
    return false;
  }

  try {
    return window.sessionStorage.getItem(projectsEntryFadeKey) === 'true';
  } catch {
    return false;
  }
};

const clearProjectsEntryFadeFlag = () => {
  if (typeof window === 'undefined') return;

  try {
    window.sessionStorage.removeItem(projectsEntryFadeKey);
  } catch {
    // Ignore storage failures; the fade is decorative.
  }
};

// --- State ---
const hasWon = ref(false);
const selectedProject = ref<Project | null>(null);
const selectedIndex = ref<number | null>(null); // Index of the selected card
const isAnimating = ref(false); // Prevent double clicks during transition
const isSwitchingProjects = ref(false); // Flag to indicate if we are switching between projects
const windowWidth = ref(typeof window !== 'undefined' ? window.innerWidth : 0); // Track window width
const showInfoTooltip = ref(false); // State for the info tooltip visibility
const isEntryFadeMounted = ref(shouldPlayProjectsEntryFade());
const isEntryFadeVisible = ref(isEntryFadeMounted.value);

// --- DOM Refs for GSAP and Tooltip ---
const projectsView = ref<HTMLElement | null>(null);
const projectsLeftColumn = ref<HTMLElement | null>(null);
const projectsListContainer = ref<HTMLElement | null>(null);
const projectCardRefs = ref<any[]>([]); // Array to hold refs to each Card component instance
const infoTooltipRef = ref<HTMLElement | null>(null); // Ref for the tooltip element

let entryFadeFrame: number | null = null;
let entryFadeTimer: number | null = null;
let pendingDetailImageSnapshot: ImageFlightSnapshot | null = null;
let activeDetailImageClone: HTMLImageElement | null = null;

const clearProjectsEntryFadeTimers = () => {
  if (typeof window === 'undefined') return;

  if (entryFadeFrame !== null) {
    window.cancelAnimationFrame(entryFadeFrame);
    entryFadeFrame = null;
  }

  if (entryFadeTimer !== null) {
    window.clearTimeout(entryFadeTimer);
    entryFadeTimer = null;
  }
};

type ColumnRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>;
type ImageFlightRect = Pick<DOMRect, 'top' | 'left' | 'width' | 'height'>;

type ImageFlightSnapshot = {
  rect: ImageFlightRect;
  src: string;
  srcset: string | null;
  sizes: string | null;
  objectFit: string;
  borderRadius: string;
  backgroundColor: string;
};

const getColumnRect = (): ColumnRect | null => {
  if (typeof window === 'undefined' || isMobile.value || !projectsLeftColumn.value) {
    return null;
  }

  const rect = projectsLeftColumn.value.getBoundingClientRect();
  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: rect.height,
  };
};

const animateLeftColumnFrom = (fromRect: ColumnRect | null, duration = 0.82) => {
  const column = projectsLeftColumn.value;
  if (!column || !fromRect || prefersReducedMotion()) {
    return;
  }

  const toRect = column.getBoundingClientRect();
  const x = fromRect.left - toRect.left;
  const y = fromRect.top - toRect.top;

  gsap.killTweensOf(column);
  gsap.set(column, {
    x,
    y,
    opacity: 0.88,
    willChange: 'transform, opacity',
    force3D: true,
  });
  gsap.to(column, {
    x: 0,
    y: 0,
    opacity: 1,
    duration,
    ease: 'power2.out',
    force3D: true,
    onComplete: () => {
      gsap.set(column, { clearProps: 'transform,willChange,opacity' });
    },
  });
};

const resetMotionState = (el: Element) => {
  gsap.set(el, { clearProps: 'transform,opacity,willChange' });
};

const getProjectCardElement = (cardRef: unknown): HTMLElement | null => {
  if (cardRef instanceof HTMLElement) {
    return cardRef;
  }

  const maybeComponent = cardRef as { $el?: unknown } | null;
  return maybeComponent?.$el instanceof HTMLElement ? maybeComponent.$el : null;
};

const captureProjectImageSnapshot = (index: number): ImageFlightSnapshot | null => {
  if (typeof window === 'undefined' || isMobile.value) {
    return null;
  }

  const card = getProjectCardElement(projectCardRefs.value[index]);
  const image = card?.querySelector('.card-image');

  if (!(image instanceof HTMLImageElement)) {
    return null;
  }

  const rect = image.getBoundingClientRect();
  const src = image.currentSrc || image.src || image.getAttribute('src') || '';

  if (!src || rect.width <= 0 || rect.height <= 0) {
    return null;
  }

  const styles = window.getComputedStyle(image);

  return {
    rect: {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    },
    src,
    srcset: image.getAttribute('srcset'),
    sizes: image.getAttribute('sizes'),
    objectFit: styles.objectFit || 'contain',
    borderRadius: styles.borderRadius || '6px',
    backgroundColor: styles.backgroundColor || '#eee',
  };
};

const removeActiveDetailImageClone = () => {
  if (!activeDetailImageClone) {
    return;
  }

  gsap.killTweensOf(activeDetailImageClone);
  activeDetailImageClone.remove();
  activeDetailImageClone = null;
};

const createDetailImageClone = (snapshot: ImageFlightSnapshot): HTMLImageElement => {
  removeActiveDetailImageClone();

  const clone = document.createElement('img');
  clone.src = snapshot.src;

  if (snapshot.srcset) {
    clone.srcset = snapshot.srcset;
  }

  if (snapshot.sizes) {
    clone.sizes = snapshot.sizes;
  }

  clone.alt = '';
  clone.setAttribute('aria-hidden', 'true');

  Object.assign(clone.style, {
    position: 'fixed',
    top: `${snapshot.rect.top}px`,
    left: `${snapshot.rect.left}px`,
    width: `${snapshot.rect.width}px`,
    height: `${snapshot.rect.height}px`,
    objectFit: snapshot.objectFit,
    borderRadius: snapshot.borderRadius,
    backgroundColor: snapshot.backgroundColor,
    pointerEvents: 'none',
    zIndex: '1400',
    boxShadow: '0 18px 50px rgba(15, 23, 42, 0.16)',
    willChange: 'top, left, width, height, opacity, filter, border-radius',
  });

  document.body.appendChild(clone);
  activeDetailImageClone = clone;

  return clone;
};

const getDetailImageTargetRect = (
  target: HTMLElement,
  snapshot: ImageFlightSnapshot | null
): ImageFlightRect => {
  const rect = target.getBoundingClientRect();

  if (rect.height > 20 || !snapshot || snapshot.rect.width <= 0) {
    return {
      top: rect.top,
      left: rect.left,
      width: rect.width,
      height: rect.height,
    };
  }

  const sourceRatio = snapshot.rect.height / snapshot.rect.width;
  const maxHeight = Math.min(window.innerHeight * 0.48, 440);
  const estimatedHeight = Math.min(rect.width * sourceRatio, maxHeight);

  return {
    top: rect.top,
    left: rect.left,
    width: rect.width,
    height: estimatedHeight,
  };
};

// --- Computed Properties ---
const isMobile = computed(() => windowWidth.value <= 1100); // Mobile breakpoint
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

  clearProjectsEntryFadeFlag();

  if (isEntryFadeMounted.value) {
    entryFadeFrame = window.requestAnimationFrame(() => {
      entryFadeFrame = null;
      isEntryFadeVisible.value = false;

      entryFadeTimer = window.setTimeout(() => {
        entryFadeTimer = null;
        isEntryFadeMounted.value = false;
      }, projectsEntryFadeDuration);
    });
  }

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
  clearProjectsEntryFadeTimers();
  removeActiveDetailImageClone();
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

  if (selectedProject.value === project) {
    // If the same project is clicked, do nothing
    return;
  }

  if (selectedProject.value && selectedProject.value !== project) {
    pendingDetailImageSnapshot = null;
    removeActiveDetailImageClone();
    selectedProject.value = project;
    selectedIndex.value = index;
    showInfoTooltip.value = false;
    isAnimating.value = false;
    return;
  }

  const leftColumnBefore = getColumnRect();
  pendingDetailImageSnapshot = captureProjectImageSnapshot(index);
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
      duration: 0.44,
      ease: 'power3.out',
      // isAnimating reset is handled in onDetailEnter
    });
  } else {
    animateLeftColumnFrom(leftColumnBefore);
  }
  // isSwitchingProjects is reset in onDetailLeave complete of the old detail
};

const hideProjectDetails = async () => {
  if (isAnimating.value && !isSwitchingProjects.value) return; // Prevent if already animating, unless switching
  // No need to check !selectedProject.value here, setting it to null handles the v-if

  const leftColumnBefore = getColumnRect();

  // Trigger the detail leave animation (handled by onDetailLeave)
  selectedProject.value = null; // Setting this to null triggers the v-if and Transition leave
  showInfoTooltip.value = false; // Hide tooltip when closing details

  await nextTick();
  animateLeftColumnFrom(leftColumnBefore, 0.34);

  // The rest of the logic happens in onDetailLeave's onLeaveComplete
};

// --- Transition Hooks ---

const onGameLeave = (el: Element, done: () => void) => {
  if (prefersReducedMotion()) { gsap.set(el, { opacity: 0 }); done(); return; }
  gsap.to(el, { opacity: 0, scale: 0.95, duration: 0.4, ease: 'power2.in', onComplete: done });
};
const onGameEnter = (el: Element, done: () => void) => {
  if (prefersReducedMotion()) { gsap.set(el, { opacity: 1, scale: 1 }); done(); return; }
  gsap.from(el, { opacity: 0, scale: 0.95, duration: 0.5, ease: 'power2.out', delay: 0.1, onComplete: done });
};

// --- Project Detail Transition Hooks ---
const onDetailEnter = (el: Element, done: () => void) => {
  if (prefersReducedMotion()) {
    removeActiveDetailImageClone();
    pendingDetailImageSnapshot = null;
    gsap.set(el, { opacity: 1, x: 0, y: 0, scale: 1, filter: 'blur(0px)' });
    gsap.set((el as HTMLElement).querySelectorAll('[data-detail-part]'), { opacity: 1, y: 0, filter: 'blur(0px)' });
    isAnimating.value = false;
    done();
    return;
  }
  gsap.set(el, { willChange: 'transform, opacity' });
  // 'el' is the projectDetailRef.$el here
  if (isMobile.value) {
    // Mobile: Slide up from bottom and fade in
    gsap.fromTo(
      el,
      { y: '100vh', opacity: 0 },
      {
        y: '0%',
        opacity: 1,
        duration: 0.82,
        ease: 'power2.out',
        force3D: true,
        onComplete: () => {
          gsap.set(el, { willChange: 'auto' });
          isAnimating.value = false;
          done();
        },
      } // Reset isAnimating here
    );
  } else {
    const detailEl = el as HTMLElement;
    const snapshot = pendingDetailImageSnapshot;
    const toolbar = detailEl.querySelector('[data-detail-toolbar]');
    const imageTarget = detailEl.querySelector('[data-detail-image]');
    const revealTargets = detailEl.querySelectorAll('[data-detail-reveal]');
    const imageClone = snapshot ? createDetailImageClone(snapshot) : null;
    const targetRect = imageTarget instanceof HTMLElement
      ? getDetailImageTargetRect(imageTarget, snapshot)
      : null;

    pendingDetailImageSnapshot = null;

    gsap.killTweensOf([detailEl, toolbar, imageTarget, revealTargets, imageClone].filter(Boolean));
    gsap.set(detailEl, {
      opacity: 0.01,
      y: 18,
      scale: 0.992,
      willChange: 'transform, opacity',
      force3D: true,
    });
    gsap.set(toolbar, {
      opacity: 0,
      y: -14,
      filter: 'blur(6px)',
      willChange: 'transform, opacity, filter',
      force3D: true,
    });
    gsap.set(imageTarget, {
      opacity: imageClone ? 0 : 1,
      y: imageClone ? 0 : -10,
      scale: imageClone ? 1 : 0.986,
      filter: imageClone ? 'blur(0px)' : 'blur(8px)',
      willChange: 'transform, opacity, filter',
      force3D: true,
    });
    gsap.set(revealTargets, {
      opacity: 0,
      y: 18,
      filter: 'blur(7px)',
      willChange: 'transform, opacity, filter',
      force3D: true,
    });

    const tl = gsap.timeline({
      onComplete: () => {
        resetMotionState(el);
        gsap.set([toolbar, imageTarget, revealTargets], { clearProps: 'transform,opacity,filter,willChange' });
        removeActiveDetailImageClone();
        isAnimating.value = false;
        done();
      },
    });

    tl.to(
      detailEl,
      {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.86,
        ease: 'power3.out',
        force3D: true,
      },
      0.06
    )
      .to(
        toolbar,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.62,
          ease: 'power3.out',
          force3D: true,
        },
        0.2
      )
      .to(
        revealTargets,
        {
          opacity: 1,
          y: 0,
          filter: 'blur(0px)',
          duration: 0.56,
          stagger: 0.055,
          ease: 'power3.out',
          force3D: true,
        },
        0.36
      );

    if (imageClone && targetRect) {
      tl.to(
        imageClone,
        {
          top: targetRect.top,
          left: targetRect.left,
          width: targetRect.width,
          height: targetRect.height,
          borderRadius: '12px',
          filter: 'blur(0px)',
          duration: 0.88,
          ease: 'expo.out',
          force3D: true,
        },
        0
      )
        .to(
          imageTarget,
          {
            opacity: 1,
            duration: 0.18,
            ease: 'power2.out',
          },
          0.76
        )
        .to(
          imageClone,
          {
            opacity: 0,
            duration: 0.16,
            ease: 'power2.out',
          },
          0.84
        );
    } else {
      tl.to(
        imageTarget,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.58,
          ease: 'power3.out',
          force3D: true,
        },
        0.08
      );
    }
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
          gsap.set(listEl, { opacity: 1 });
        }
      }
    }
    // Always reset isSwitchingProjects after the old detail's leave transition finishes
    isSwitchingProjects.value = false;
    gsap.set(el, { willChange: 'auto' });
    done(); // Signal Vue transition is complete
  };

  if (prefersReducedMotion()) {
    removeActiveDetailImageClone();
    gsap.set(el, { opacity: 0, filter: 'blur(0px)' });
    onLeaveComplete();
    return;
  }
  gsap.set(el, { willChange: 'transform, opacity' });
  if (isMobile.value) {
    // Mobile: Slide down and fade out
    gsap.to(el, { y: '100vh', opacity: 0, duration: 0.36, ease: 'power2.in', force3D: true, onComplete: onLeaveComplete });
  } else {
    removeActiveDetailImageClone();

    const detailEl = el as HTMLElement;
    const toolbar = detailEl.querySelector('[data-detail-toolbar]');
    const imageTarget = detailEl.querySelector('[data-detail-image]');
    const revealTargets = detailEl.querySelectorAll('[data-detail-reveal]');

    gsap.killTweensOf([detailEl, toolbar, imageTarget, revealTargets].filter(Boolean));
    gsap.set([detailEl, toolbar, imageTarget, revealTargets], {
      willChange: 'transform, opacity, filter',
      force3D: true,
    });

    gsap.timeline({
      onComplete: () => {
        gsap.set([toolbar, imageTarget, revealTargets], { clearProps: 'transform,opacity,filter,willChange' });
        onLeaveComplete();
      },
    })
      .to(
        revealTargets,
        {
          opacity: 0,
          y: -8,
          filter: 'blur(5px)',
          duration: 0.18,
          stagger: 0.025,
          ease: 'power2.in',
          force3D: true,
        },
        0
      )
      .to(
        toolbar,
        {
          opacity: 0,
          y: -8,
          filter: 'blur(4px)',
          duration: 0.22,
          ease: 'power2.in',
          force3D: true,
        },
        0.02
      )
      .to(
        imageTarget,
        {
          opacity: 0.32,
          y: -6,
          filter: 'blur(4px)',
          duration: 0.24,
          ease: 'power2.in',
          force3D: true,
        },
        0.04
      )
      .to(
        detailEl,
        {
          opacity: 0,
          x: 18,
          y: 4,
          scale: 0.992,
          duration: 0.3,
          ease: 'power2.in',
          force3D: true,
        },
        0.08
      );
  }
};

// --- Watchers ---
watch(hasWon, async (newValue) => {
  if (newValue) {
    await nextTick();
    if (projectsListContainer.value) {
      const cards = projectsListContainer.value.querySelectorAll('.project-card');
      gsap.set(projectsListContainer.value, { opacity: 1, x: 0 }); // Ensure initial state
      if (prefersReducedMotion()) {
        gsap.set(cards, { opacity: 1, y: 0 });
      } else {
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
  overflow-x: clip;
}

.projects-entry-fade {
  position: fixed;
  inset: 0;
  z-index: 2000;
  background: #ffffff;
  opacity: 0;
  pointer-events: none;
  transition-property: opacity;
  transition-duration: 100ms;
  transition-timing-function: ease-out;
  will-change: opacity;
}

.projects-entry-fade.is-visible {
  opacity: 1;
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

.content-container.projects-detail-open {
  align-items: flex-start;
  padding: 0 0 2rem 2rem;
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

.projects-view.detail-active-desktop {
  align-items: stretch;
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
  font-family: 'Sora', 'Segoe UI', Arial, sans-serif;
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
  transition-property: background-color, border-color, color;
  transition-duration: 0.2s;
  transition-timing-function: ease;
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
.projects-content {
  width: 100%;
  display: grid;
  grid-template-columns: minmax(0, 1fr);
  align-items: start;
}

.projects-left-column {
  min-width: 0;
  width: 100%;
}

.projects-list-container {
  width: 100%;
  display: flex;
  justify-content: center;
  flex-shrink: 0;
  transform: translate3d(0, 0, 0);
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
  transform: translate3d(0, 0, 0) scale(0.98);
  box-shadow: none;
}

/* --- Detail Component Styling --- */
:global(.project-detail-component) {
  box-sizing: border-box;
  z-index: 10;
}

:global(.project-detail-component:not(.is-mobile)) {
  --project-detail-top-gap: 3.6rem;
  --project-detail-bottom-gap: 1rem;
  position: sticky;
  top: var(--project-detail-top-gap);
  align-self: start;
  width: 100%;
  max-width: none;
  min-height: 0;
  height: calc(100vh - var(--project-detail-top-gap) - var(--project-detail-bottom-gap));
  height: calc(100dvh - var(--project-detail-top-gap) - var(--project-detail-bottom-gap));
  max-height: none;
  margin-top: var(--project-detail-top-gap);
  margin-bottom: var(--project-detail-bottom-gap);
  overflow-y: auto;
  overflow-x: hidden;
  overscroll-behavior: contain;
  scrollbar-gutter: stable;
  padding: 0;
  border-radius: 14px 14px 0 0;
  background: #fff;
  box-shadow: -18px 0 50px rgba(30, 41, 59, 0.12), -1px 0 0 rgba(15, 23, 42, 0.06);
  contain: paint;
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
@media (min-width: 1101px) {
  h2 {
    margin-top: 30px;
  }
}

@media (min-width: 1101px) {
  .projects-view.detail-active-desktop {
    max-width: min(1600px, 100vw);
  }

  .projects-content.has-detail {
    grid-template-columns: minmax(390px, 0.82fr) minmax(520px, 1fr);
    gap: clamp(1.5rem, 3vw, 3.25rem);
  }

  .projects-content.has-detail .projects-list {
    justify-content: flex-start;
    align-content: flex-start;
  }

  .projects-content.has-detail .project-card {
    max-width: 100%;
    margin-left: 0;
    margin-right: 0;
  }
}

/* --- Responsive --- */
@media (max-width: 1100px) {
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
