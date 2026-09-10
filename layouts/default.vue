<template>
    <div class="site-container">
      <header
        v-if="!isHomePage"
        class="site-header"
        :class="{
          'menu-open': isNavMenuOpen,
          'nav-hidden': isNavHidden
        }"
      >
        <SiteNav
          @hidden-change="isNavHidden = $event"
          @menu-change="isNavMenuOpen = $event"
        />
      </header>
      <main>
        <slot />
      </main>
    </div>
</template>

<script setup>
const route = useRoute();
const isHomePage = computed(() => route.path === '/');
const isNavHidden = ref(false);
const isNavMenuOpen = ref(false);
</script>

<style>
/* Add content-visibility to improve rendering performance */
.site-container {
  min-height: 100vh;
  display: flex;
  flex-direction: column;
}

main {
  flex: 1;
}

.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensure it stays on top */
  background-color: transparent;
  transition-property: background-color, transform, opacity;
  transition-duration: 0.3s, 0.42s, 0.24s;
  transition-timing-function: ease-in-out, cubic-bezier(0.2, 0, 0, 1), ease-out;
  padding: 16px 24px;
  display: flex; /* Use flexbox for layout */
  align-items: center; /* Vertically center content */
  transform: translate3d(0, 0, 0);
  opacity: 1;
  will-change: transform;
  /* margin-left: 30px; */
}

.site-header.menu-open {
  background-color: white;
}

.site-header.nav-hidden {
  transform: translate3d(-10px, -76px, 0);
  opacity: 0;
  pointer-events: none;
}

@media (max-width: 900px) {
  .site-header.menu-open {
    background-color: transparent;
  }

  .site-header {
    padding: 6px 12px;
    margin-bottom: 20px;
  }
}

/* Keep the fixed nav compact on mobile */
@media (max-width: 768px) {
  .site-header {
    padding: 6px 12px !important; /* Compact mobile header padding */
    margin-bottom: 20px !important;
  }
  
  /* Target all possible root elements of pages */
  section, 
  .projects-list,
  .contact-page-container,
  div > .timeline-outer:first-child,
  div > h2.section-heading:first-child {
    padding-top: 25px !important; /* Increased padding and added !important to override scoped styles */
    margin-top: 50px !important; 
  }
}

@media (prefers-reduced-motion: reduce) {
  .site-header {
    transition-duration: 0.01ms;
  }
}

</style>
