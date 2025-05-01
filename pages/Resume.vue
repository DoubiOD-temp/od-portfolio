<template>
  <div> <h2 class="section-heading">Work history</h2>

    <div class="timeline-outer">
      <div
        v-for="(event, idx) in workEvents"
        :key="'work-' + idx"
        class="timeline-row"
        :class="event.side"
      >
        <div class="timeline-col left">
          <template v-if="event.side === 'right'">
            <div class="timeline-meta">
              <span>{{ event.location }}</span>
              <span>{{ event.dateRange }}</span>
            </div>
          </template>
          <template v-else>
            <div class="timeline-card">
              <h3 class="timeline-title">{{ event.title }}</h3>
              <div class="timeline-subtitle">{{ event.subtitle }}</div>
              <ul v-if="event.bullets && event.bullets.length" class="timeline-bullets">
                <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
              </ul>
            </div>
          </template>
        </div>

        <div class="timeline-col center">
          <span class="timeline-dot-simple" :style="{ backgroundColor: event.dotColor }"></span>
        </div>

        <div class="timeline-col right">
          <template v-if="event.side === 'right'">
            <div class="timeline-card">
              <h3 class="timeline-title">{{ event.title }}</h3>
              <div class="timeline-subtitle">{{ event.subtitle }}</div>
              <ul v-if="event.bullets && event.bullets.length" class="timeline-bullets">
                <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="timeline-meta">
              <span>{{ event.location }}</span>
              <span>{{ event.dateRange }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <hr class="section-separator" />

    <h2 class="section-heading academic">Academic history</h2>

    <div class="timeline-outer">
      <div
        v-for="(event, idx) in academicEvents"
        :key="'academic-' + idx"
        class="timeline-row"
        :class="event.side"
      >
        <div class="timeline-col left">
          <template v-if="event.side === 'right'">
            <div class="timeline-meta">
              <span>{{ event.location }}</span>
              <span>{{ event.dateRange }}</span>
            </div>
          </template>
          <template v-else>
            <div class="timeline-card">
              <h3 class="timeline-title">{{ event.title }}</h3>
              <div class="timeline-subtitle">{{ event.subtitle }}</div>
              <ul v-if="event.bullets && event.bullets.length" class="timeline-bullets">
                <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
              </ul>
            </div>
          </template>
        </div>

        <div class="timeline-col center">
          <span class="timeline-dot-simple" :style="{ backgroundColor: event.dotColor }"></span>
        </div>

        <div class="timeline-col right">
          <template v-if="event.side === 'right'">
            <div class="timeline-card">
              <h3 class="timeline-title">{{ event.title }}</h3>
              <div class="timeline-subtitle">{{ event.subtitle }}</div>
              <ul v-if="event.bullets && event.bullets.length" class="timeline-bullets">
                <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="timeline-meta">
              <span>{{ event.location }}</span>
              <span>{{ event.dateRange }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

  </div> </template>

<script setup>
import { ref } from 'vue';
import '~/assets/css/timeline.css'

// Renamed original events to workEvents
const workEvents = ref([
  {
    title: 'IT Tester (ext.)',
    subtitle: 'InterWay, a. s',
    location: 'Bratislava, Slovakia',
    dateRange: 'Apr. 2024 – present',
    dotColor: '#0063FB',
    side: 'right',
    bullets: [ /* Bullets included */ ]
  },
  {
    title: 'R&D Assistant',
    subtitle: 'Sternula A/S ',
    location: 'Aalborg, Denmark',
    dateRange: 'Jul. 2022 – Jan. 2024',
    dotColor: '#F24405',
    side: 'left',
    bullets: [ /* Bullets included */ ]
  },
  {
    title: 'Junior software developer intern',
    subtitle: 'Nowire s.r.o',
    location: 'Bratislava, Slovakia',
    dateRange: 'Aug. 2023 – Oct. 2023',
    dotColor: '#5ab1e8',
    side: 'right',
    bullets: [ /* Bullets included */ ]
  },
  {
    title: 'Full-stack software developer intern',
    subtitle: 'DECK1 A/S',
    location: 'Aalborg, Denmark',
    dateRange: 'Feb. 2023 – Jun. 2023',
    dotColor: '#2d2d2d',
    side: 'left',
    bullets: [ /* Bullets included */ ]
  },
  {
    title: 'Project analyst / UI designer',
    subtitle: 'Nowire s.r.o',
    location: 'Bratislava, Slovakia',
    dateRange: 'Feb. 2021 – Aug. 2021',
    dotColor: '#5ab1e8',
    side: 'right',
    bullets: [ /* Bullets included */ ]
  }
]);

// New data for Academic History
const academicEvents = ref([
 {
    title: 'MSc Eng. Software Development',
    subtitle: 'IT University of Copenhagen',
    location: 'Copenhagen, Denmark',
    dateRange: 'Sep. 2024 - Present',
    dotColor: '#2ecc71', // Example color
    side: 'right',
    bullets: [
        'Specializing in Advanced Computing Systems.',
        'Relevant coursework: Distributed Systems, Algorithm Design.'
    ]
  },
  {
    title: 'BSc. Web Development',
    subtitle: 'Business Academy Aarhus',
    location: 'Aarhus, Denmark',
    dateRange: 'Sep. 2021 – Jan. 2024',
    dotColor: '#3498db', // Example color
    side: 'left',
    bullets: [
      'Focused on full-stack development using JavaScript frameworks and .NET.',
      'Bachelor thesis: "Real-time Data Visualization for Maritime Operations".',
      'Exchange semester at Example University, Canada (Fall 2022).'
    ]
  },
   {
    title: 'AP Degree Computer Science',
    subtitle: 'Business Academy Aarhus',
    location: 'Aarhus, Denmark',
    dateRange: 'Sep. 2019 – Jun. 2021',
    dotColor: '#f1c40f', // Example color
    side: 'right',
    bullets: [
        'Foundation in programming (Java, C#), databases, and system architecture.'
    ]
  },
  // Add more academic events if needed
]);

// Fill in bullet points for workEvents (omitted for brevity)
workEvents.value[0].bullets = [
      'Implemented automated tests using Java and Selenide framework',
      'Performed manual testing based on established test cases',
      'Identified errors and problems, documented and reported findings',
      'Collaborated with software developers and analysts to resolve errors and technical issues'
];
workEvents.value[1].bullets = [
      'Designed Operation Control Center screens for satellite telemetry analytics',
      'Led student team in developing the back-end of the Maritime Messaging Service Edge Router using Java',
      'Developed alerting system using telemetry data through Python, InfluxDB, and Grafana',
      'Created automatic telemetry download script utilizing Python',
      'Engineered schedule synchronization and data management tool with Python'
];
workEvents.value[2].bullets = [
      'Contributed to the development of an internal ticket management system, enhancing operational efficiency within the organization'
];
workEvents.value[3].bullets = [
      'Developed Weather & Vessel Operation Prediction software using Vue.js, Nuxt.js, Python, .NET, TypeScript, and MongoDB for decision support in offshore wind turbine operations',
      'Created visualizations of asset performance based on historical data analysis',
      'Designed an intuitive dashboard for multiple stakeholders to support strategic decision-making'
];
workEvents.value[4].bullets = [
      'Conducted analytical activities including software requirements analysis, documentation, and user acceptance testing',
      'Created software design prototypes utilizing Angular components and Adobe Photoshop',
      'Redesigned company website using WordPress'
];

</script>