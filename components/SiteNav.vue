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
    { text: 'Resume', to: '/' },
    { text: 'Contact', to: '/' }
  ];
  </script>
  
  <style scoped>
  .site-nav {
    position: fixed;
    top: 32px;
    left: 32px;
    z-index: 1000;
    font-family: 'Inter', 'Arial', sans-serif;
  }
  .site-nav ul {
    display: flex;
    gap: 28px;
    list-style: none;
    padding: 0;
    margin: 0;
  }
  .site-nav a {
    text-decoration: none;
    color: #222;
    font-size: 1.1rem;
    font-weight: 500;
    letter-spacing: 0.02em;
    transition: color 0.2s;
  }
  .site-nav a:hover {
    color: #0070f3;
  }
  </style>
  