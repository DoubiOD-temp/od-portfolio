<template>
    <section>
      <Vue3Lottie
        animation-link="/animations/od-portfolio.json"
        :loop="false"
        :autoplay="true"
      />
    </section>
  </template>

<style scoped>
section {
 width: 100%;
 max-width: 1000px; /* Or the desired max width */
 margin: 0 auto; /* Center the container */
 overflow: hidden; /* Prevent overflow */
}

/* Adjust size for smaller screens */
@media (max-width: 768px) {
 section {
   max-width: 100%;
 }
}
</style>