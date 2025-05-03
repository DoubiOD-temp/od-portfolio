<template>
    <nav class="site-nav" :class="{ 'menu-open': isMenuOpen }">
      <button class="burger-menu" @click="toggleMenu">
        <div class="line"></div>
        <div class="line"></div>
        <div class="line"></div>
      </button>
      <div class="nav-list-container">
        <ul>
          <li v-for="item in navItems" :key="item.text">
            <NuxtLink :to="item.to" @click="isMenuOpen = false">{{ item.text }}</NuxtLink>
          </li>
        </ul>
      </div>
    </nav>
  </template>
  
  <script setup>
  import { ref } from 'vue';

  const isMenuOpen = ref(false);

  const toggleMenu = () => {
    isMenuOpen.value = !isMenuOpen.value;
  };

  const navItems = [
    { text: 'Home', to: '/' },
    { text: 'Projects', to: '/Projects' },
    { text: 'Resume', to: '/Resume' },
    { text: 'Contact', to: '/Contact' }
  ];
  </script>
