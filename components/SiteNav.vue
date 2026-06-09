<template>
  <nav
    class="site-nav"
    :class="{
      'menu-open': isMenuOpen,
      'nav-hidden': isNavHidden
    }"
  >
    <button class="burger-menu"
            @click="toggleMenu"
            aria-label="Toggle navigation menu"
            :aria-expanded="isMenuOpen">
      <div class="line"></div>
      <div class="line"></div>
      <div class="line"></div>
    </button>
    <div class="nav-list-container">
      <ul>
        <li
          v-for="(item, index) in navItems"
          :key="item.text"
          :style="{ '--nav-delay': `${index * 42}ms` }"
        >
          <NuxtLink :to="item.to"
                    @click="closeMenu"
                    :prefetch="item.text === 'Projects' || item.text === 'Contact'">
            {{ item.text }}
          </NuxtLink>
        </li>
      </ul>
    </div>
  </nav>
</template>
  
<script setup>
import { ref, onBeforeUnmount, onMounted, watch } from 'vue';

const isMenuOpen = ref(false);
const isNavHidden = ref(false);
const emit = defineEmits(['hidden-change', 'menu-change']);

let lastScrollY = 0;
let ticking = false;
const scrollThreshold = 12;
const topRevealOffset = 24;
const scrollTargets = [];

const getScrollY = () => Math.max(
  window.scrollY,
  document.documentElement.scrollTop,
  document.body.scrollTop,
  0
);

// Performance optimized toggle function
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  
  // If menu is opened, prevent scrolling on body to reduce repaints
  if (isMenuOpen.value) {
    isNavHidden.value = false;
    document.body.style.overflow = 'hidden';
  } else {
    document.body.style.overflow = '';
  }
};

// Separate function to close menu
const closeMenu = () => {
  if (isMenuOpen.value) {
    isMenuOpen.value = false;
    document.body.style.overflow = '';
  }
};

const updateNavVisibility = () => {
  const currentScrollY = getScrollY();
  const scrollDelta = currentScrollY - lastScrollY;

  if (isMenuOpen.value || currentScrollY <= topRevealOffset) {
    isNavHidden.value = false;
    lastScrollY = currentScrollY;
  } else if (Math.abs(scrollDelta) >= scrollThreshold) {
    isNavHidden.value = scrollDelta > 0;
    lastScrollY = currentScrollY;
  }

  ticking = false;
};

const handleScroll = () => {
  if (ticking) return;

  ticking = true;
  window.requestAnimationFrame(updateNavVisibility);
};

// Close menu on escape key for accessibility
const handleEscKey = (e) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
};

// Add/remove event listeners properly
onMounted(() => {
  lastScrollY = getScrollY();
  document.addEventListener('keydown', handleEscKey);

  scrollTargets.push(window, document, document.documentElement, document.body);
  scrollTargets.forEach((target) => {
    target.addEventListener('scroll', handleScroll, { passive: true });
  });
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey);
  scrollTargets.forEach((target) => {
    target.removeEventListener('scroll', handleScroll);
  });
  scrollTargets.length = 0;
  // Reset body overflow in case component is unmounted while menu is open
  document.body.style.overflow = '';
});

watch(isNavHidden, (hidden) => {
  emit('hidden-change', hidden);
}, { immediate: true });

watch(isMenuOpen, (open) => {
  emit('menu-change', open);
}, { immediate: true });

// Static navigation items - won't change, no need for reactivity
const navItems = [
  { text: 'Home', to: '/' },
  { text: 'Projects', to: '/projects' },
  { text: 'Internship', to: '/Internship' },
  { text: 'Resume', to: '/resume' },
  { text: 'Contact', to: '/contact' }
];
</script>
