<template>
  <div class="contact-page">
    <div class="contact-stack">
      <div class="card">
        <video
          ref="videoRef"
          class="orb-video"
          autoplay
          muted
          loop
          playsinline
          preload="metadata"
          poster="/contact-orb-poster.jpg"
        >
          <source src="/contact-orb.webm" type="video/webm" />
          <source src="/contact-orb.mp4" type="video/mp4" />
        </video>
        <div class="header-row">
          <div class="identity">
            <NuxtImg
              src="/images/profile.png"
              alt="Ondrej Dobiš"
              class="profile-img"
              width="56"
              height="56"
              sizes="56px"
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
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#0A66C2" width="36" height="36" aria-hidden="true">
                <path d="M20.45 20.45h-3.55v-5.57c0-1.33-.02-3.04-1.85-3.04-1.85 0-2.13 1.45-2.13 2.94v5.67H9.36V9h3.41v1.56h.05c.47-.9 1.64-1.85 3.37-1.85 3.6 0 4.27 2.37 4.27 5.46v6.28zM5.34 7.43a2.06 2.06 0 1 1 0-4.12 2.06 2.06 0 0 1 0 4.12zM7.12 20.45H3.56V9h3.56v11.45zM22.22 0H1.77C.79 0 0 .77 0 1.72v20.56C0 23.23.79 24 1.77 24h20.45c.98 0 1.78-.77 1.78-1.72V1.72C24 .77 23.2 0 22.22 0z"/>
              </svg>
            </a>
            <a href="https://github.com/DoubiOD-temp" target="_blank" rel="noopener" aria-label="GitHub (work)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#181717" width="36" height="36" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
              </svg>
            </a>
            <a href="https://github.com/DoubiOD" target="_blank" rel="noopener" aria-label="GitHub (personal)">
              <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="#181717" width="36" height="36" aria-hidden="true">
                <path d="M12 .5C5.65.5.5 5.65.5 12c0 5.08 3.29 9.39 7.86 10.91.58.1.79-.25.79-.56 0-.28-.01-1.02-.02-2-3.2.7-3.87-1.54-3.87-1.54-.52-1.33-1.28-1.69-1.28-1.69-1.05-.72.08-.7.08-.7 1.16.08 1.77 1.19 1.77 1.19 1.03 1.77 2.7 1.26 3.36.96.1-.75.4-1.26.73-1.55-2.55-.29-5.24-1.28-5.24-5.7 0-1.26.45-2.29 1.18-3.1-.12-.29-.51-1.46.11-3.05 0 0 .97-.31 3.18 1.18.92-.26 1.91-.39 2.89-.39.98 0 1.97.13 2.89.39 2.21-1.49 3.18-1.18 3.18-1.18.62 1.59.23 2.76.11 3.05.74.81 1.18 1.84 1.18 3.1 0 4.43-2.69 5.41-5.26 5.69.41.36.78 1.07.78 2.16 0 1.56-.01 2.82-.01 3.2 0 .31.21.67.8.56C20.21 21.39 23.5 17.08 23.5 12 23.5 5.65 18.35.5 12 .5z"/>
              </svg>
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

.socials-row img,
.socials-row svg {
  width: 36px !important;
  height: 36px !important;
  min-width: 36px;
  object-fit: contain;
  transition: transform 0.2s ease-in-out;
  display: block;
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

  .socials-row img,
  .socials-row svg {
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
