<template>
  <div class="contact-page">
    <div class="contact-stack">
      <div class="card">
        <video
          ref="videoRef"
          class="orb-video"
          src="/contact-orb.mp4"
          autoplay
          muted
          loop
          playsinline
          preload="auto"
        />
        <div class="header-row">
          <div class="identity">
            <img
              src="/images/profile.png"
              alt="Ondrej Dobiš"
              class="profile-img"
              loading="eager"
              fetchpriority="high"
            />
            <h1 class="name">Ondrej Dobiš</h1>
          </div>
        </div>

        <p class="tagline">
          Applied Computer Science student &amp; software developer based in Bratislava, Slovakia.
        </p>

        <div class="footer-row">
          <div class="contact-lines">
            <a href="tel:+421910111092">+421 910 111 092</a>
            <a href="mailto:dobisondrej@gmail.com">dobisondrej@gmail.com</a>
          </div>

          <div class="socials-row">
            <a href="https://www.linkedin.com/in/ondrej-dobis/" target="_blank" rel="noopener" aria-label="LinkedIn">
              <img src="/images/linkedin.png" alt="LinkedIn" />
            </a>
            <a href="https://github.com/DoubiOD-temp" target="_blank" rel="noopener" aria-label="GitHub (work)">
              <img src="/images/github.png" alt="GitHub" />
            </a>
            <a href="https://github.com/DoubiOD" target="_blank" rel="noopener" aria-label="GitHub (personal)">
              <img src="/images/github.png" alt="GitHub" />
            </a>
          </div>
        </div>
      </div>

      <div class="actions">
        <a class="btn btn-primary" href="/CV/Ondrej_Dobis-CV-3_2025.pdf" target="_blank" rel="noopener">
          Download CV
        </a>
        <a class="btn btn-secondary" href="/CV/Ondrej RL2024.pdf" target="_blank" rel="noopener">
          Letter of Recommendation
        </a>
      </div>
    </div>
  </div>
</template>

<script setup lang="ts">
import { ref, onMounted, onBeforeUnmount } from 'vue';

const videoRef = ref<HTMLVideoElement | null>(null);

const handleVisibility = () => {
  const v = videoRef.value;
  if (!v) return;
  if (document.hidden) v.pause();
  else v.play().catch(() => {});
};

onMounted(() => {
  document.addEventListener('visibilitychange', handleVisibility);
});

onBeforeUnmount(() => {
  document.removeEventListener('visibilitychange', handleVisibility);
});
</script>

<style scoped>
.contact-page,
.contact-page * {
  box-sizing: border-box;
}

.contact-page {
  position: relative;
  min-height: calc(100vh - 75px);
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 2rem 1.5rem;
  overflow: hidden;
  font-family: 'Inter', 'Segoe UI', Arial, sans-serif;
}

.orb-video {
  position: absolute;
  inset: 0;
  width: 100%;
  height: 100%;
  object-fit: cover;
  z-index: 0;
  pointer-events: none;
  opacity: 0.24;
  transform: scale(2.4);
  transform-origin: center;
  filter: blur(17px) saturate(1.2);
}

.contact-stack {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 1.25rem;
  width: 100%;
  max-width: 30rem;
}

.card {
  position: relative;
  display: flex;
  flex-direction: column;
  justify-content: space-between;
  align-items: stretch;
  width: 100%;
  aspect-ratio: 1.75 / 1;
  padding: 1.75rem 2rem;
  background: rgba(255, 255, 255, 0.78);
  backdrop-filter: blur(24px) saturate(1.15);
  -webkit-backdrop-filter: blur(24px) saturate(1.15);
  border-radius: 16px;
  overflow: hidden;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(255, 255, 255, 0.4) inset;
  isolation: isolate;
}

.card > *:not(.orb-video) {
  position: relative;
  z-index: 1;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 1rem;
  justify-content: flex-start;
}

.identity {
  display: flex;
  align-items: center;
  gap: 0.85rem;
  min-width: 0;
}

.profile-img {
  width: 56px;
  height: 56px;
  border-radius: 50%;
  object-fit: cover;
  box-shadow: 0 2px 6px rgba(0, 0, 0, 0.1);
  flex-shrink: 0;
}

.name {
  font-size: 1.45rem;
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
  color: #111;
  min-width: 0;
}

.tagline {
  font-size: 1.05rem;
  line-height: 1.5;
  color: #1a1a1a;
  margin: auto 0;
}

.footer-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  margin-top: auto;
}

.contact-lines {
  font-size: 1rem;
  line-height: 1.4;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  text-align: left;
  gap: 0.15rem;
}

.contact-lines a {
  color: inherit;
  text-decoration: none;
  border-bottom: 1px solid transparent;
  transition: border-color 0.15s ease;
}

.contact-lines a:hover {
  border-bottom-color: currentColor;
}

.actions {
  display: flex;
  flex-wrap: nowrap;
  justify-content: center;
  gap: 0.6rem;
}

.btn {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  padding: 0.7rem 1.25rem;
  border-radius: 999px;
  font-size: 0.95rem;
  font-weight: 500;
  text-decoration: none;
  white-space: nowrap;
  flex-shrink: 0;
  transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease;
  cursor: pointer;
}

.btn-primary {
  background: #111;
  color: #fff;
}

.btn-primary:hover {
  transform: translateY(-2px);
  background: #000;
}

.btn-secondary {
  background: transparent;
  color: #111;
  border: 1px solid rgba(0, 0, 0, 0.25);
}

.btn-secondary:hover {
  transform: translateY(-2px);
  border-color: rgba(0, 0, 0, 0.5);
}

.socials-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
}

.socials-row a {
  display: inline-flex;
  background: transparent;
  border-radius: 0;
  box-shadow: none;
  padding: 0;
  transition: transform 0.2s ease-in-out;
}

.socials-row a:hover {
  background: transparent;
  transform: scale(1.1);
}

.socials-row img {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px;
  object-fit: contain;
  transition: transform 0.2s ease-in-out;
}

@media (max-width: 600px) {
  .contact-page {
    padding: 1.5rem 1rem;
  }

  .contact-stack {
    gap: 1rem;
    max-width: 100%;
  }

  .card {
    aspect-ratio: auto;
    min-height: 17rem;
    padding: 1.5rem 1.4rem;
    gap: 0;
    display: flex;
  }

  .header-row {
    justify-content: flex-start;
  }

  .name {
    font-size: 1.3rem;
  }

  .tagline {
    font-size: 1rem;
  }

  .contact-lines {
    font-size: 0.95rem;
  }

  .profile-img {
    width: 52px;
    height: 52px;
  }

  .socials-row {
    gap: 0.6rem;
  }

  .socials-row img {
    width: 33px !important;
    height: 33px !important;
    min-width: 36px;
    object-fit: contain;
  }

  .orb-video {
    transform: scale(3);
  }

  .btn {
    padding: 0.65rem 1rem;
    font-size: 0.85rem;
  }
}
</style>
