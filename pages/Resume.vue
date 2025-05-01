<template>
  <div class="timeline-container">
    <div
      v-for="(event, idx) in timelineEvents"
      :key="idx"
      class="timeline-item"
      :class="event.side"
    >
      <!-- Date (shown on opposite side of card) -->
      <div v-if="event.side === 'right'" class="timeline-date">{{ event.dateRange }}</div>
      <div v-else class="timeline-empty"></div>

      <!-- Timeline center with dot -->
      <div class="timeline-center">
        <div class="timeline-dot" :style="{ background: event.color }">
          <div class="timeline-dot-glow" :style="{ background: `radial-gradient(circle, ${event.color}55 0%, transparent 70%)` }"></div>
        </div>
      </div>

      <!-- Card or empty space -->
      <div v-if="event.side === 'right'" class="timeline-empty"></div>
      <div v-else class="timeline-card">
        <h3 class="timeline-heading">{{ event.title }}</h3>
        <div class="timeline-subtitle">{{ event.subtitle }}</div>
        <div class="timeline-location">{{ event.location }}</div>
        <ul class="timeline-bullets">
          <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
        </ul>
      </div>

      <!-- Date or Card (opposite to the date) -->
      <div v-if="event.side === 'left'" class="timeline-date">{{ event.dateRange }}</div>
      <div v-else class="timeline-card">
        <h3 class="timeline-heading">{{ event.title }}</h3>
        <div class="timeline-subtitle">{{ event.subtitle }}</div>
        <div class="timeline-location">{{ event.location }}</div>
        <ul class="timeline-bullets">
          <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
        </ul>
      </div>
    </div>
  </div>
</template>

<script setup>
const timelineEvents = [
  {
    title: 'IT Tester (ext.)',
    subtitle: 'InterWay, a. s',
    location: 'Bratislava, Slovakia',
    dateRange: 'Apr. 2024 – present',
    color: '#c0392b',
    side: 'right',
    bullets: [
      'Implemented automated tests using Java and Selenide framework',
      'Performed manual testing based on established test cases',
      'Identified errors and problems, documented and reported findings',
      'Collaborated with software developers and analysts to resolve errors and technical issues'
    ]
  },
  {
    title: 'R&D Assistant',
    subtitle: 'Sternula A/S',
    location: 'Aalborg, Denmark',
    dateRange: 'Jul. 2022 – Jan. 2024',
    color: '#27ae60',
    side: 'left',
    bullets: [
      'Designed Operation Control Center screens for satellite telemetry analytics',
      'Led student team in developing the back-end of the Maritime Messaging Service Edge Router using Java',
      'Developed alerting system using telemetry data through Python, InfluxDB, and Grafana',
      'Created automatic telemetry download script utilizing Python',
      'Engineered schedule synchronization and data management tool with Python'
    ]
  },
  {
    title: 'Junior software developer intern',
    subtitle: 'Nowire s.r.o',
    location: 'Bratislava, Slovakia',
    dateRange: 'Aug. 2023 – Oct. 2023',
    color: '#2980b9',
    side: 'right',
    bullets: [
      'Contributed to the development of an internal ticket management system, enhancing operational efficiency within the organization'
    ]
  },
  {
    title: 'Full-stack software developer intern',
    subtitle: 'DECK1 A/S',
    location: 'Aalborg, Denmark',
    dateRange: 'Feb. 2023 – Jun. 2023',
    color: '#8e44ad',
    side: 'left',
    bullets: [
      'Developed Weather & Vessel Operation Prediction software using Vue.js, Nuxt.js, Python, .NET, TypeScript, and MongoDB for decision support in offshore wind turbine operations',
      'Created visualizations of asset performance based on historical data analysis',
      'Designed an intuitive dashboard for multiple stakeholders to support strategic decision-making'
    ]
  },
  {
    title: 'Project analyst / UI designer',
    subtitle: 'Nowire s.r.o',
    location: 'Bratislava, Slovakia',
    dateRange: 'Feb. 2021 – Aug. 2021',
    color: '#3498db',
    side: 'right',
    bullets: [
      'Conducted analytical activities including software requirements analysis, documentation, and user acceptance testing',
      'Created software design prototypes utilizing Angular components and Adobe Photoshop',
      'Redesigned company website using WordPress'
    ]
  }
];

// GSAP animation can be added here with onMounted hook if needed
</script>