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
