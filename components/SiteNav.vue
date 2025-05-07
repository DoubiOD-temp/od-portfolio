<template>
  <nav class="site-nav" :class="{ 'menu-open': isMenuOpen }">
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
        <li v-for="item in navItems" :key="item.text">
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
import { ref, onBeforeUnmount, onMounted } from 'vue';

const isMenuOpen = ref(false);

// Performance optimized toggle function
const toggleMenu = () => {
  isMenuOpen.value = !isMenuOpen.value;
  
  // If menu is opened, prevent scrolling on body to reduce repaints
  if (isMenuOpen.value) {
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

// Close menu on escape key for accessibility
const handleEscKey = (e) => {
  if (e.key === 'Escape' && isMenuOpen.value) {
    closeMenu();
  }
};

// Add/remove event listeners properly
onMounted(() => {
  document.addEventListener('keydown', handleEscKey);
});

onBeforeUnmount(() => {
  document.removeEventListener('keydown', handleEscKey);
  // Reset body overflow in case component is unmounted while menu is open
  document.body.style.overflow = '';
});

// Static navigation items - won't change, no need for reactivity
const navItems = [
  { text: 'Home', to: '/' },
  // { text: 'About', to: '/About' },
  { text: 'Projects', to: '/Projects' },
  { text: 'Resume', to: '/Resume' },
  { text: 'Contact', to: '/Contact' }
];
</script>
