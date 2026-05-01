<template>
  <section class="hero-scroll">
    <div class="hero-stage">
      <div ref="phoneEl" class="phone">
        <div class="lottie-container">
          <client-only>
            <Vue3Lottie
              ref="iphoneLottie"
              animation-link="/animations/iphone.json"
              :loop="false"
              :auto-play="false"
              :options="lottieOptions"
              @on-complete="unlockScroll"
            />
          </client-only>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted, onBeforeUnmount, inject, defineAsyncComponent } from 'vue';
import { gsap } from 'gsap';

const Vue3Lottie = defineAsyncComponent(() =>
  import('vue3-lottie').then((m) => m.Vue3Lottie)
);

const iphoneLottie = ref(null);
const phoneEl = ref(null);
const isLowEndDevice = inject('isLowEndDevice', () => false);

const lottieOptions = {
  rendererSettings: {
    progressiveLoad: true,
    preserveAspectRatio: 'xMidYMid meet'
  }
};

let lockHandlers = null;
let isLocked = false;

const blockKey = (e) => {
  const blocked = [' ', 'PageDown', 'PageUp', 'ArrowDown', 'ArrowUp', 'End', 'Home', 'Spacebar'];
  if (blocked.includes(e.key)) e.preventDefault();
};
const blockEvent = (e) => e.preventDefault();

const lockScroll = () => {
  if (isLocked) return;
  isLocked = true;
  window.addEventListener('wheel', blockEvent, { passive: false });
  window.addEventListener('touchmove', blockEvent, { passive: false });
  window.addEventListener('keydown', blockKey, { passive: false });
  lockHandlers = { wheel: blockEvent, touch: blockEvent, key: blockKey };
};

const unlockScroll = () => {
  if (!lockHandlers) return;
  window.removeEventListener('wheel', lockHandlers.wheel);
  window.removeEventListener('touchmove', lockHandlers.touch);
  window.removeEventListener('keydown', lockHandlers.key);
  lockHandlers = null;
  isLocked = false;
};

const playLottie = () => {
  if (iphoneLottie.value && iphoneLottie.value.play) {
    iphoneLottie.value.play();
  }
};

onMounted(() => {
  if (typeof window === 'undefined') return;

  // Pin scroll to top while the intro plays.
  window.scrollTo(0, 0);
  lockScroll();

  if (isLowEndDevice()) {
    // Skip the tilt-in tween on weak devices; just fire the Lottie.
    setTimeout(playLottie, 300);
    return;
  }

  const isMobile = window.matchMedia('(max-width: 768px)').matches;
  const fromScale = isMobile ? 0.85 : 1.05;
  const toScale = isMobile ? 1 : 1;

  gsap.fromTo(
    phoneEl.value,
    { rotateX: 45, scale: fromScale, y: 220, opacity: 0 },
    {
      rotateX: 0,
      scale: toScale,
      y: 0,
      opacity: 1,
      duration: 2.6,
      delay: 0.3,
      ease: 'expo.out',
      onComplete: playLottie,
    }
  );
});

onBeforeUnmount(() => {
  unlockScroll();
});
</script>

<style scoped>
.hero-scroll {
  position: relative;
  height: 100vh;
}

.hero-stage {
  height: 100vh;
  display: flex;
  align-items: center;
  justify-content: center;
  perspective: 1000px;
}

.phone {
  transform-style: preserve-3d;
  will-change: transform, opacity;
  max-width: 400px;
  width: 100%;
  margin: 0 auto;
}

.lottie-container {
  width: 100%;
}

.lottie-container :deep(canvas) {
  width: 100% !important;
  height: auto !important;
}

@media (max-width: 768px) {
  /* Layout applies large section offsets on mobile; pull hero up without touching desktop */
  .hero-scroll {
    margin-top: 0 !important;
    padding-top: max(calc(env(safe-area-inset-top, 0px) + 40px), 40px) !important;
  }

  .hero-stage {
    align-items: flex-start;
    justify-content: center;
    padding-top: 0;
    box-sizing: border-box;
  }

  .phone {
    max-width: min(360px, 90vw);
  }
}
</style>
