<template>
  <section class="home-page" aria-label="Portfolio preview">
    <div class="showcase-media">
      <video
        ref="desktopVideo"
        class="showcase-video showcase-video-desktop"
        src="/home/home-desktop.mp4"
        autoplay
        muted
        playsinline
        webkit-playsinline
        preload="metadata"
        @ended="handleVideoEnded"
      />
      <video
        ref="mobileVideo"
        class="showcase-video showcase-video-mobile"
        src="/home/home-mobile.mp4"
        autoplay
        muted
        playsinline
        webkit-playsinline
        preload="metadata"
        @ended="handleVideoEnded"
      />
      <video
        ref="desktopTransitionVideo"
        class="showcase-video showcase-video-desktop showcase-transition-video"
        :class="{ 'is-active': activeTransitionVariant === 'desktop' }"
        src="/home/home-transition-desktop.mp4"
        muted
        playsinline
        webkit-playsinline
        preload="auto"
        @ended="handleVideoEnded"
      />
      <video
        ref="mobileTransitionVideo"
        class="showcase-video showcase-video-mobile showcase-transition-video"
        :class="{ 'is-active': activeTransitionVariant === 'mobile' }"
        src="/home/home-transition-mobile.mp4"
        muted
        playsinline
        webkit-playsinline
        preload="auto"
        @ended="handleVideoEnded"
      />
      <video
        ref="mobileEdgeBlurVideo"
        class="showcase-video showcase-video-mobile showcase-edge-blur-video"
        src="/home/home-mobile.mp4"
        autoplay
        muted
        playsinline
        webkit-playsinline
        preload="metadata"
        aria-hidden="true"
      />
      <video
        ref="mobileTransitionEdgeBlurVideo"
        class="showcase-video showcase-video-mobile showcase-edge-blur-video showcase-transition-video"
        :class="{ 'is-active': activeTransitionVariant === 'mobile' }"
        src="/home/home-transition-mobile.mp4"
        autoplay
        muted
        playsinline
        webkit-playsinline
        preload="auto"
        aria-hidden="true"
      />
    </div>

    <button
      type="button"
      class="showcase-cta"
      :class="{
        'is-pending': isTransitionPending,
        'is-launching': isTransitionVideoActive
      }"
      :style="ctaProgressStyle"
      :aria-label="isTransitionLocked ? 'Entering projects' : 'View Projects'"
      :disabled="isTransitionLocked"
      @click="playProjectsTransition"
    >
      <span class="showcase-cta-label">{{ ctaLabel }}</span>
    </button>

    <div
      class="home-white-transition"
      :class="{ 'is-active': isFadingToWhite }"
      aria-hidden="true"
    />
  </section>
</template>

<script setup>
import { computed, onBeforeUnmount, onMounted, ref } from 'vue';

const desktopVideo = ref(null);
const mobileVideo = ref(null);
const desktopTransitionVideo = ref(null);
const mobileTransitionVideo = ref(null);
const mobileEdgeBlurVideo = ref(null);
const mobileTransitionEdgeBlurVideo = ref(null);
const isTransitionPending = ref(false);
const isTransitioning = ref(false);
const activeTransitionVariant = ref(null);
const replayTimers = new Set();
const replayDelay = 1300;
const defaultTransitionFallbackDelay = 4200;
const transitionFallbackBuffer = 700;
const pageFadeDuration = 200;
const projectsEntryFadeKey = 'od-projects-entry-fade';
const projectsPath = '/projects';

let transitionVideo = null;
let transitionTimer = null;
let whiteFadeTimer = null;
let hasNavigated = false;
let pendingLoopVideo = null;
let pendingTransitionContext = null;
let transitionReadyHandler = null;
let errorHandler = null;
let progressFrame = null;
let edgeBlurSyncFrame = null;
let pendingProgressStart = 0;
let pendingProgressEnd = 0;
let usesRestrictedAutoplay = false;

const autoplayTimers = new Set();
const mediaListenerRemovers = [];
const primedVideos = new WeakSet();
const gestureListenerRemovers = [];
const autoplayGestureEvents = ['pointerdown', 'touchstart', 'keydown', 'wheel'];

const isFadingToWhite = ref(false);
const transitionProgress = ref(0);
const isTransitionLocked = computed(() => isTransitionPending.value || isTransitioning.value);
const ctaLabel = computed(() => (isTransitionLocked.value ? 'Entering' : 'View Projects'));
const ctaProgressStyle = computed(() => ({
  '--cta-progress': `${Math.round(transitionProgress.value * 360)}deg`
}));
const isTransitionVideoActive = computed(() => activeTransitionVariant.value !== null);

const clearReplayTimers = () => {
  replayTimers.forEach((timer) => window.clearTimeout(timer));
  replayTimers.clear();
};

const clearTransitionTimer = () => {
  if (!transitionTimer) return;

  window.clearTimeout(transitionTimer);
  transitionTimer = null;
};

const clearWhiteFadeTimer = () => {
  if (!whiteFadeTimer) return;

  window.clearTimeout(whiteFadeTimer);
  whiteFadeTimer = null;
};

const clearProgressFrame = () => {
  if (!progressFrame) return;

  window.cancelAnimationFrame(progressFrame);
  progressFrame = null;
};

const clearEdgeBlurSyncFrame = () => {
  if (!edgeBlurSyncFrame) return;

  window.cancelAnimationFrame(edgeBlurSyncFrame);
  edgeBlurSyncFrame = null;
};

// Every iOS browser is WebKit under the hood, so Chrome/Firefox/Edge on iOS inherit Safari's
// autoplay rules. iPadOS also reports itself as "Macintosh", hence the touch-point check.
const isRestrictedAutoplayBrowser = () => {
  const userAgent = navigator.userAgent;
  const isIosLike = /iphone|ipad|ipod/i.test(userAgent)
    || (/macintosh/i.test(userAgent) && navigator.maxTouchPoints > 1);
  const isDesktopSafari = /safari/i.test(userAgent)
    && !/chrome|chromium|crios|fxios|edg|edgios|android/i.test(userAgent);

  return isIosLike || isDesktopSafari;
};

const getHomepageVideos = () => [
  desktopVideo.value,
  mobileVideo.value,
  desktopTransitionVideo.value,
  mobileTransitionVideo.value,
  mobileEdgeBlurVideo.value,
  mobileTransitionEdgeBlurVideo.value
];

const prepareInlineAutoplayVideo = (video) => {
  if (!video) return;

  video.muted = true;
  video.defaultMuted = true;
  video.playsInline = true;
  video.controls = false;
  video.setAttribute('muted', '');
  video.setAttribute('playsinline', '');
  video.setAttribute('webkit-playsinline', '');

  try {
    video.webkitPlaysInline = true;
  } catch {
    // Older WebKit accepts the attribute even if the property is read-only.
  }
};

const primeAutoplayVideo = (video) => {
  if (!video) return;

  prepareInlineAutoplayVideo(video);
  video.preload = 'auto';

  if (!primedVideos.has(video) && video.readyState < HTMLMediaElement.HAVE_CURRENT_DATA) {
    primedVideos.add(video);
    video.load();
  }
};

const playInlineAutoplayVideo = async (video, { prime = false, loop = false } = {}) => {
  if (!video || hasNavigated || isTransitioning.value) return;

  if (prime) {
    primeAutoplayVideo(video);
  } else {
    prepareInlineAutoplayVideo(video);
  }

  video.loop = loop;

  if (!video.paused && !video.ended) return;

  try {
    await video.play();
  } catch {
    // Playback stays blocked until the page is visible/focused, or — under iOS Low Power Mode and
    // "Never Auto-Play" — until a real user gesture. The retries and gesture fallback cover both.
  }
};

const prepareHomepageVideos = () => {
  getHomepageVideos().forEach(prepareInlineAutoplayVideo);
};

const getActiveLoopVideos = () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  return isMobile
    ? [mobileVideo.value, mobileEdgeBlurVideo.value]
    : [desktopVideo.value];
};

const playActiveLoopVideos = ({ prime = false } = {}) => {
  if (document.hidden || isTransitionPending.value || isTransitioning.value) return;

  getActiveLoopVideos().forEach((video) => {
    // A finished non-looping video belongs to the replay timer; restarting it here would cut the
    // deliberate pause between loops short.
    if (video && video.ended && !video.loop) return;

    playInlineAutoplayVideo(video, { prime, loop: usesRestrictedAutoplay });
  });
};

const clearAutoplayTimers = () => {
  autoplayTimers.forEach((timer) => window.clearTimeout(timer));
  autoplayTimers.clear();
};

const scheduleAutoplayAttempt = (delay) => {
  const timer = window.setTimeout(() => {
    autoplayTimers.delete(timer);
    playActiveLoopVideos({ prime: delay === 0 });
  }, delay);

  autoplayTimers.add(timer);
};

const scheduleAutoplayAttempts = () => {
  clearAutoplayTimers();
  [0, 80, 240, 600, 1200, 2400].forEach(scheduleAutoplayAttempt);
};

const addMediaReadinessListeners = () => {
  ['loadedmetadata', 'loadeddata', 'canplay', 'canplaythrough'].forEach((eventName) => {
    getHomepageVideos().forEach((video) => {
      if (!video) return;

      video.addEventListener(eventName, scheduleAutoplayAttempts);
      mediaListenerRemovers.push(() => {
        video.removeEventListener(eventName, scheduleAutoplayAttempts);
      });
    });
  });
};

const removeMediaReadinessListeners = () => {
  mediaListenerRemovers.forEach((removeListener) => removeListener());
  mediaListenerRemovers.length = 0;
};

// Low Power Mode and "Never Auto-Play" reject play() no matter how often we retry — only a user
// gesture lifts the block. Any tap, key or scroll anywhere on the page counts, so the visitor never
// has to find and press the video's native play button.
const handleAutoplayGesture = () => {
  playActiveLoopVideos({ prime: true });
};

const addAutoplayGestureFallback = () => {
  autoplayGestureEvents.forEach((eventName) => {
    document.addEventListener(eventName, handleAutoplayGesture, { capture: true, passive: true });
    gestureListenerRemovers.push(() => {
      document.removeEventListener(eventName, handleAutoplayGesture, { capture: true });
    });
  });
};

const removeAutoplayGestureFallback = () => {
  gestureListenerRemovers.forEach((removeListener) => removeListener());
  gestureListenerRemovers.length = 0;
};

const setupAutoplay = () => {
  usesRestrictedAutoplay = isRestrictedAutoplayBrowser();

  prepareHomepageVideos();
  addMediaReadinessListeners();
  addAutoplayGestureFallback();
  scheduleAutoplayAttempts();
  document.addEventListener('visibilitychange', scheduleAutoplayAttempts);
  window.addEventListener('focus', scheduleAutoplayAttempts);
  window.addEventListener('pageshow', scheduleAutoplayAttempts);
  window.addEventListener('resize', scheduleAutoplayAttempts);
};

const cleanupAutoplay = () => {
  document.removeEventListener('visibilitychange', scheduleAutoplayAttempts);
  window.removeEventListener('focus', scheduleAutoplayAttempts);
  window.removeEventListener('pageshow', scheduleAutoplayAttempts);
  window.removeEventListener('resize', scheduleAutoplayAttempts);
  removeMediaReadinessListeners();
  removeAutoplayGestureFallback();
  clearAutoplayTimers();
};

const clearTransitionListeners = () => {
  if (!transitionVideo) return;

  if (transitionReadyHandler) {
    transitionVideo.removeEventListener('loadeddata', transitionReadyHandler);
    transitionReadyHandler = null;
  }

  if (errorHandler) {
    transitionVideo.removeEventListener('error', errorHandler);
    errorHandler = null;
  }
};

const markProjectsEntryFade = () => {
  try {
    window.sessionStorage.setItem(projectsEntryFadeKey, 'true');
  } catch {
    // The navigation should still happen if storage is unavailable.
  }
};

const restartVideo = (event) => {
  const video = event.target;

  const timer = window.setTimeout(() => {
    replayTimers.delete(timer);
    video.currentTime = 0;

    if (usesRestrictedAutoplay) {
      playInlineAutoplayVideo(video, { loop: true });
      return;
    }

    video.play();
  }, replayDelay);

  replayTimers.add(timer);
};

const completeProjectsTransition = () => {
  if (hasNavigated) return;

  hasNavigated = true;
  clearTransitionTimer();
  clearTransitionListeners();

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    navigateTo(projectsPath);
    return;
  }

  isFadingToWhite.value = true;
  clearWhiteFadeTimer();

  whiteFadeTimer = window.setTimeout(() => {
    markProjectsEntryFade();
    navigateTo(projectsPath);
  }, pageFadeDuration);
};

const getTransitionFallbackDelay = (video) => {
  const duration = video.duration;

  if (Number.isFinite(duration) && duration > 0) {
    return (duration * 1000) + transitionFallbackBuffer;
  }

  return defaultTransitionFallbackDelay;
};

const startTransitionFallback = (video) => {
  clearTransitionTimer();
  transitionTimer = window.setTimeout(
    completeProjectsTransition,
    getTransitionFallbackDelay(video)
  );
};

const waitForTransitionFrame = (video) => new Promise((resolve, reject) => {
  if (video.readyState >= HTMLMediaElement.HAVE_CURRENT_DATA) {
    resolve();
    return;
  }

  transitionReadyHandler = () => {
    clearTransitionListeners();
    resolve();
  };

  errorHandler = () => {
    clearTransitionListeners();
    reject(new Error('Transition video failed to load.'));
  };

  video.addEventListener('loadeddata', transitionReadyHandler, { once: true });
  video.addEventListener('error', errorHandler, { once: true });
});

const isVideoEffectivelyEnded = (video) => {
  if (video.ended) return true;

  const duration = video.duration;
  if (!Number.isFinite(duration) || duration <= 0) {
    return false;
  }

  return duration - video.currentTime <= 0.08;
};

const clampProgress = (value) => Math.min(Math.max(value, 0), 1);

const getPendingProgress = (video) => {
  if (pendingProgressEnd <= pendingProgressStart) {
    return 1;
  }

  return clampProgress(
    (video.currentTime - pendingProgressStart) / (pendingProgressEnd - pendingProgressStart)
  );
};

const updatePendingProgress = (video) => {
  transitionProgress.value = getPendingProgress(video);

  if (!isTransitionPending.value || video !== pendingLoopVideo || transitionProgress.value >= 1) {
    progressFrame = null;
    return;
  }

  progressFrame = window.requestAnimationFrame(() => updatePendingProgress(video));
};

const startPendingProgress = (video) => {
  clearProgressFrame();

  const duration = video.duration;
  const hasDuration = Number.isFinite(duration) && duration > 0;

  pendingProgressStart = hasDuration ? Math.min(video.currentTime, duration) : 0;
  pendingProgressEnd = hasDuration ? duration : 0;
  transitionProgress.value = 0;
  progressFrame = window.requestAnimationFrame(() => updatePendingProgress(video));
};

const getEdgeBlurPairs = () => [
  { source: mobileVideo.value, mirror: mobileEdgeBlurVideo.value },
  { source: mobileTransitionVideo.value, mirror: mobileTransitionEdgeBlurVideo.value }
];

const syncEdgeBlurVideo = (source, mirror) => {
  if (!source || !mirror) return;

  try {
    const sourceTime = source.currentTime;
    if (Number.isFinite(sourceTime) && Math.abs(mirror.currentTime - sourceTime) > 0.05) {
      mirror.currentTime = sourceTime;
    }

    if (mirror.playbackRate !== source.playbackRate) {
      mirror.playbackRate = source.playbackRate;
    }
  } catch {
    return;
  }

  if (source.paused || source.ended) {
    if (!mirror.paused) {
      mirror.pause();
    }

    return;
  }

  if (mirror.paused) {
    mirror.play().catch(() => {});
  }
};

const syncEdgeBlurVideos = () => {
  getEdgeBlurPairs().forEach(({ source, mirror }) => syncEdgeBlurVideo(source, mirror));
  edgeBlurSyncFrame = window.requestAnimationFrame(syncEdgeBlurVideos);
};

const getActiveVideoContext = () => {
  const isMobile = window.matchMedia('(max-width: 768px)').matches;

  return isMobile
    ? { idleVideo: mobileVideo.value, transition: mobileTransitionVideo.value, variant: 'mobile' }
    : { idleVideo: desktopVideo.value, transition: desktopTransitionVideo.value, variant: 'desktop' };
};

const startTransitionVideo = async ({ idleVideo, transition, variant }) => {
  if (hasNavigated || isTransitioning.value) return;

  clearProgressFrame();
  transitionProgress.value = 1;
  isTransitionPending.value = false;
  isTransitioning.value = true;
  pendingLoopVideo = null;
  pendingTransitionContext = null;
  transitionVideo = transition;
  activeTransitionVariant.value = null;
  clearReplayTimers();

  idleVideo.pause();
  transition.pause();
  transition.currentTime = 0;
  transition.load();
  startTransitionFallback(transition);

  try {
    await waitForTransitionFrame(transition);
    activeTransitionVariant.value = variant;
    startTransitionFallback(transition);
    await transition.play();
  } catch {
    completeProjectsTransition();
  }
};

const playProjectsTransition = () => {
  if (isTransitioning.value) return;
  if (isTransitionPending.value) return;

  if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) {
    completeProjectsTransition();
    return;
  }

  const { idleVideo, transition, variant } = getActiveVideoContext();

  if (!idleVideo || !transition) {
    completeProjectsTransition();
    return;
  }

  clearReplayTimers();
  const transitionContext = { idleVideo, transition, variant };

  if (usesRestrictedAutoplay) {
    idleVideo.loop = false;
    mobileEdgeBlurVideo.value?.removeAttribute('loop');
    if (mobileEdgeBlurVideo.value) {
      mobileEdgeBlurVideo.value.loop = false;
    }
  }

  if (isVideoEffectivelyEnded(idleVideo)) {
    startTransitionVideo(transitionContext);
    return;
  }

  isTransitionPending.value = true;
  pendingLoopVideo = idleVideo;
  pendingTransitionContext = transitionContext;
  startPendingProgress(idleVideo);

  if (idleVideo.paused) {
    if (usesRestrictedAutoplay) {
      prepareInlineAutoplayVideo(idleVideo);
    }

    idleVideo.play().catch(() => {
      startTransitionVideo(transitionContext);
    });
  }
};

const handleVideoEnded = (event) => {
  const video = event.target;

  if (isTransitionPending.value && video === pendingLoopVideo) {
    if (!pendingTransitionContext) return;

    startTransitionVideo(pendingTransitionContext);
    return;
  }

  if (isTransitioning.value) {
    if (video === transitionVideo) {
      completeProjectsTransition();
    }

    return;
  }

  restartVideo(event);
};

onMounted(() => {
  setupAutoplay();
  syncEdgeBlurVideos();
});

onBeforeUnmount(() => {
  cleanupAutoplay();
  clearReplayTimers();
  clearTransitionTimer();
  clearWhiteFadeTimer();
  clearTransitionListeners();
  clearProgressFrame();
  clearEdgeBlurSyncFrame();
  isTransitionPending.value = false;
  pendingLoopVideo = null;
  pendingTransitionContext = null;
  activeTransitionVariant.value = null;
});
</script>

<style scoped>
.home-page {
  position: relative;
  min-height: 100vh;
  max-width: none;
  width: 100vw;
  padding: 0;
  box-sizing: border-box;
  overflow: hidden;
  /* Matches the video's own backdrop so the bleed edges are seamless; the mobile
     breakpoint below restores #fbfafa, where the video is letterboxed on purpose. */
  background: #fdfdfd;
}

.showcase-media {
  position: absolute;
  inset: 0;
  z-index: 0;
  width: 100%;
  height: 100%;
  overflow: hidden;
  background: #fdfdfd;
}

.showcase-media::after {
  content: '';
  display: none;
  position: absolute;
  right: 0;
  bottom: auto;
  left: 0;
  z-index: 4;
  height: var(--showcase-edge-height);
  pointer-events: none;
  top: var(--showcase-edge-overlay-top);
  background: linear-gradient(
    to bottom,
    rgba(251, 250, 250, 0),
    rgba(251, 250, 250, 0.82) 72%,
    #fbfafa 100%
  );
}

.showcase-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
}

.showcase-transition-video {
  z-index: 1;
  opacity: 0;
  pointer-events: none;
}

.showcase-transition-video.is-active {
  opacity: 1;
}

.showcase-edge-blur-video {
  z-index: 2;
  clip-path: inset(
    var(--showcase-edge-top)
    0
    calc(100% - var(--showcase-edge-bottom))
    0
  );
  display: none;
  filter: blur(12px) saturate(1.02);
  mask-image: linear-gradient(
    to bottom,
    transparent 0,
    transparent var(--showcase-edge-top),
    #000000 var(--showcase-edge-bottom),
    #000000 100%
  );
  opacity: 1;
  pointer-events: none;
  -webkit-mask-image: linear-gradient(
    to bottom,
    transparent 0,
    transparent var(--showcase-edge-top),
    #000000 var(--showcase-edge-bottom),
    #000000 100%
  );
}

.showcase-edge-blur-video.showcase-transition-video {
  z-index: 3;
  opacity: 0;
}

.showcase-edge-blur-video.showcase-transition-video.is-active {
  opacity: 1;
}

.showcase-video-mobile {
  display: none;
}

.showcase-video-desktop {
  top: 0;
  right: auto;
  bottom: auto;
  left: 50%;
  width: 100%;
  height: 100%;
  /* Fill the viewport rather than sitting in a boxed-in 81% frame. Contain keeps the whole
     scene visible at any window shape — cover would crop the side cards on narrow windows
     and the bottom of the wordmark on wide, short ones. The container background matches the
     video's backdrop, so the letterboxed edges are invisible. */
  object-fit: contain;
  object-position: top center;
  transform: translateX(-50%);
}

.showcase-edge-blur-video.showcase-video-desktop {
  display: none;
}

.showcase-cta {
  --cta-fill: rgb(77, 99, 187);
  --cta-color: #ffffff;
  --cta-ring-fill: rgba(255, 255, 255, 0);
  --cta-ring-track: rgba(255, 255, 255, 0);
  --cta-progress: 0deg;

  position: absolute;
  left: 50%;
  bottom: max(calc(env(safe-area-inset-bottom, 0px) + 48px), 48px);
  z-index: 2;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 52px;
  min-width: 168px;
  padding: 0 28px;
  border: 3px solid transparent;
  border-radius: 999px;
  background:
    linear-gradient(var(--cta-fill), var(--cta-fill)) padding-box,
    conic-gradient(
      from -90deg,
      var(--cta-ring-fill) var(--cta-progress),
      var(--cta-ring-track) 0deg
    ) border-box;
  color: var(--cta-color);
  appearance: none;
  cursor: pointer;
  font-family: 'Sora', 'Segoe UI', Arial, sans-serif;
  font-size: 1rem;
  font-weight: 600;
  line-height: 1;
  text-decoration: none;
  box-shadow: 0 14px 34px rgba(77, 99, 187, 0.26);
  filter: blur(0);
  transform: translateX(-50%);
  transition-property: transform, opacity, box-shadow, color, filter, background;
  transition-duration: 220ms;
  transition-timing-function: cubic-bezier(0.2, 0, 0, 1);
  will-change: transform;
}

.showcase-cta:hover {
  --cta-fill: rgb(88, 112, 205);

  transform: translateX(-50%) translateY(-3px) scale(1.025);
  color: #ffffff;
  box-shadow: 0 20px 42px rgba(77, 99, 187, 0.34);
}

.showcase-cta:active {
  transform: translateX(-50%) translateY(0) scale(0.96);
}

.showcase-cta:focus-visible {
  outline: 3px solid rgba(77, 99, 187, 0.32);
  outline-offset: 4px;
}

.showcase-cta:disabled {
  opacity: 1;
}

.showcase-cta-label {
  position: relative;
  z-index: 1;
}

.showcase-cta.is-pending {
  --cta-fill: rgba(251, 250, 250, 0.88);
  --cta-color: rgb(48, 67, 145);
  --cta-ring-fill: rgb(77, 99, 187);
  --cta-ring-track: rgba(77, 99, 187, 0.18);

  color: var(--cta-color);
  cursor: default;
  box-shadow: 0 16px 36px rgba(77, 99, 187, 0.18);
  transform: translateX(-50%) translateY(-1px) scale(1.01);
}

.showcase-cta.is-launching {
  pointer-events: none;
  opacity: 0;
  cursor: default;
  filter: blur(5px);
  transform: translateX(-50%) translateY(-8px) scale(1.04);
  transition-duration: 260ms;
}

.home-white-transition {
  position: fixed;
  inset: 0;
  z-index: 3;
  background: #ffffff;
  opacity: 0;
  pointer-events: none;
  will-change: opacity;
}

.home-white-transition.is-active {
  animation: home-fade-to-white 200ms ease-out forwards;
  opacity: 1;
}

@keyframes home-fade-to-white {
  0% {
    opacity: 0;
  }

  25%,
  100% {
    opacity: 1;
  }
}

@media (max-width: 768px) {
  .home-page {
    margin-top: 0 !important;
    padding: 0 !important;
    background: #fbfafa;
  }

  .showcase-media {
    --showcase-mobile-rendered-height: min(102vh, 177.5926vw);
    --showcase-edge-height: min(5.1vh, 8.8796vw);
    --showcase-edge-bottom: var(--showcase-mobile-rendered-height);
    --showcase-edge-top: calc(var(--showcase-edge-bottom) - var(--showcase-edge-height));
    --showcase-edge-overlay-top: calc(-2vh + var(--showcase-edge-top));

    background: #fbfafa;
  }

  .showcase-media::after {
    display: block;
  }

  .showcase-video-desktop {
    display: none;
  }

  .showcase-video-mobile {
    display: block;
    top: -2%;
    bottom: auto;
    height: 102%;
    object-fit: contain;
    object-position: top center;
  }

  .showcase-cta {
    bottom: max(calc(env(safe-area-inset-bottom, 0px) + 32px), 32px);
    min-height: 50px;
    min-width: 156px;
    padding: 0 24px;
  }
}

@media (min-width: 769px) {
  .showcase-cta {
    box-shadow: none;
    filter: none;
    transition-property: transform, opacity, color, background;
  }

  .showcase-cta:hover,
  .showcase-cta.is-pending {
    box-shadow: none;
  }

  .showcase-cta.is-launching {
    filter: none;
  }
}

@media (prefers-reduced-motion: reduce) {
  .showcase-cta {
    transition-property: box-shadow, color, background;
    transition-duration: 160ms;
    will-change: auto;
  }

  .showcase-cta:hover,
  .showcase-cta:active,
  .showcase-cta.is-pending,
  .showcase-cta.is-launching {
    transform: translateX(-50%);
  }

  .showcase-cta.is-launching {
    filter: none;
    transition-duration: 1ms;
  }
}
</style>
