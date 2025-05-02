<template>
    <div>
      <header class="site-header">
        <SiteNav />
      </header>
    </div>
</template>

<style>
.site-header {
  position: fixed;
  top: 0;
  left: 0;
  width: 100%;
  z-index: 1000; /* Ensure it stays on top */
  background-color: white;
  padding: 25px 40px; /* Increased vertical padding, slight left padding */
  display: flex; /* Use flexbox for layout */
  align-items: center; /* Vertically center content */
  /* margin-left: 30px; */
}

/* Reduce mobile navbar height to 75% of current height when not expanded */
@media (max-width: 768px) {
  .site-header {
    padding: 8px 16px; /* Reduced vertical padding to 75% of original (25px → 19px) */
    margin-bottom: 20px;
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

main {
  padding-top: 80px; /* Adjusted padding-top to remove gap */
}
</style>
