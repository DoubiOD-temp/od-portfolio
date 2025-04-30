<template>
  <section class="card-stack-section">
    <div class="card-container" ref="containerRef">
      <div 
        v-for="(card, i) in cards" 
        :key="card.title"
        class="card"
        :ref="el => { if (el) cardRefs[i] = el }"
        :style="{ zIndex: cards.length - i }" 
      >
        <div class="card-content">
          <h2>{{ card.title }}</h2>
          <p>{{ card.text }}</p>
          <div class="images-grid">
            <div class="image-wrapper main-image">
              <div class="image-label">Image {{ i * 3 + 1 }}</div>
            </div>
            <div class="image-wrapper small-image">
              <div class="image-label">Image {{ i * 3 + 2 }}</div>
            </div>
            <div class="image-wrapper small-image">
              <div class="image-label">Image {{ i * 3 + 3 }}</div>
            </div>
          </div>
        </div>
      </div>
    </div>
  </section>
</template>

<script setup>
import { ref, onMounted } from 'vue';
import gsap from 'gsap';
import ScrollTrigger from 'gsap/ScrollTrigger';

gsap.registerPlugin(ScrollTrigger);

const cards = [
  { title: 'Card Five', text: 'Top card with maximum elevation' },
  { title: 'Card Four', text: 'Strategic solution showcase' },
  { title: 'Card Three', text: 'Interactive demo platform' },
  { title: 'Card Two', text: 'Innovation hub display' },
  { title: 'Card One', text: 'Foundation layer with core features' }
];

const cardRefs = ref([]);
const containerRef = ref(null);

onMounted(() => {
  ScrollTrigger.getAll().forEach(st => st.kill());
  setTimeout(initAnimation, 100);
});

function initAnimation() {
  if (!containerRef.value || cardRefs.value.length === 0) return;

  const viewportHeight = window.innerHeight;
  const cardExpandedHeight = viewportHeight * 0.7;
  const cardCollapsedHeight = cardExpandedHeight * 0.4;

  cardRefs.value.forEach((card, i) => {
    gsap.set(card, {
      y: i * 60,
      scale: 1 - (i * 0.08),
      opacity: 1 - (i * 0.15),
      transformOrigin: "center top"
    });
  });

  ScrollTrigger.create({
    trigger: containerRef.value,
    start: "top 20%",
    end: () => `+=${cardExpandedHeight * cards.length}`,
    pin: true,
    scrub: 0.7,
    onUpdate: self => {
      const rawProgress = self.progress;
      
      cardRefs.value.forEach((card, i) => {
        const cardProgress = Math.max(0, Math.min(1, 
          (rawProgress - (i * 0.18)) / 0.22
        ));

        gsap.to(card, {
          y: i * 60 - (cardProgress * (cardExpandedHeight - cardCollapsedHeight)),
          scale: (1 - (i * 0.08)) + (cardProgress * (i * 0.08)),
          opacity: (1 - (i * 0.15)) + (cardProgress * (i * 0.15)),
          duration: 0.1
        });
      });
    }
  });
}
</script>

<style scoped>
.card-stack-section {
  width: 100vw;
  height: 100vh;
  background: #f0f2f5;
}

.card-container {
  position: relative;
  width: 90%;
  height: calc(100vh * 5);
  margin: 0 auto;
}

.card {
  position: absolute;
  width: 100%;
  height: 70vh;
  max-height: 70vh;
  background: #fff;
  border-radius: 24px;
  box-shadow: 0 12px 50px rgba(0, 0, 0, 0.15);
  transition: filter 0.3s ease;
}

.card-content {
  width: 85%;
  height: 80%;
  margin: 5% auto;
  padding: 2.5%;
}

.images-grid {
  display: grid;
  grid-template-columns: 1fr 0.5fr;
  grid-template-rows: repeat(2, 1fr);
  gap: 1.2rem;
  height: 60%;
}

@media (max-width: 768px) {
  .card {
    height: 60vh;
    max-height: 60vh;
  }
  
  .card-content {
    width: 90%;
    padding: 5%;
  }
}
</style>
