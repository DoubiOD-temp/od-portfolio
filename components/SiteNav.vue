<template>
    <nav class="site-nav">
      <ul>
        <li v-for="item in navItems" :key="item.text">
          <NuxtLink :to="item.to">{{ item.text }}</NuxtLink>
        </li>
      </ul>
    </nav>
  </template>
  
  <script setup>
  const navItems = [
    { text: 'Home', to: '/' },
    { text: 'About', to: '/About' },
    { text: 'Projects', to: '/Projects' },
    { text: 'Resume', to: '/Resume' },
    { text: 'Contact', to: '/Contact' }
  ];
  </script>