<template>
  <div class="contact-page">
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

    <div class="contact-info">
      <div class="header-row">
        <img
          src="/images/profile.png"
          alt="Ondrej Dobiš"
          class="profile-img"
          loading="eager"
          fetchpriority="high"
        />
        <h1 class="name">Ondrej Dobiš</h1>
      </div>

      <p class="tagline">
        Applied Computer Science student &amp; software developer based in Bratislava, Slovakia.
      </p>

      <div class="contact-row">
        <div class="contact-lines">
          <a href="mailto:dobisondrej@gmail.com">dobisondrej@gmail.com</a>
          <a href="tel:+421910111092">+421 910 111 092</a>
        </div>
        <div class="socials">
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
}

.contact-info {
  position: relative;
  z-index: 1;
  display: flex;
  flex-direction: column;
  align-items: stretch;
  gap: 1rem;
  max-width: 26rem;
  padding: 1.5rem;
  background: rgba(255, 255, 255, 0.72);
  backdrop-filter: blur(20px) saturate(1.1);
  -webkit-backdrop-filter: blur(20px) saturate(1.1);
  border-radius: 20px;
  box-shadow: 0 8px 32px rgba(0, 0, 0, 0.08), 0 0 0 0.5px rgba(255, 255, 255, 0.4) inset;
}

.header-row {
  display: flex;
  align-items: center;
  gap: 0.85rem;
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
  font-size: clamp(1.5rem, 3vw, 1.875rem);
  font-weight: 600;
  letter-spacing: -0.02em;
  margin: 0;
  line-height: 1.1;
  color: #111;
}

.tagline {
  font-size: 0.95rem;
  line-height: 1.5;
  color: #1a1a1a;
  margin: 0;
}

.contact-row {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 1rem;
  flex-wrap: wrap;
}

.contact-lines {
  font-size: 0.875rem;
  line-height: 1.45;
  color: #1a1a1a;
  margin: 0;
  display: flex;
  flex-direction: column;
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
  flex-wrap: wrap;
  gap: 0.5rem;
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

.socials {
  display: flex;
  align-items: center;
  gap: 0.6rem;
}

.socials a {
  display: inline-flex;
}

.socials img {
  width: 32px;
  height: 32px;
  transition: transform 0.2s ease-in-out;
}

.socials a:hover img {
  transform: scale(1.1);
}

@media (max-width: 600px) {
  .contact-info {
    padding: 1.25rem;
  }

  .profile-img {
    width: 48px;
    height: 48px;
  }
}
</style>
