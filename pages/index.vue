<template>
    <section>
      <Vue3Lottie
        animation-link="/animations/od-portfolio.json"
        :loop="false"
        :autoplay="true"
      />
      <TicTacToeGame />
    </section>
  </template>

<script setup>
import TicTacToeGame from '~/components/TicTacToeGame.vue'; // Adjust path if necessary
</script>

<style scoped>
section {
  padding-top: 30px !important; 
}
</style>