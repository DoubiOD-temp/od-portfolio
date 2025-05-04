<template>
  <div>
    <h2 class="section-heading">Work experience</h2>
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
              <span class="timeline-location">{{ event.location }}</span>
              <span>{{ event.dateRange }}</span>
              <span class="work-type">{{ event.type }}</span>
            </div>
          </template>
          <template v-else>
            <div class="timeline-card">
              <h3 class="timeline-title">{{ event.title }}</h3>
              <div class="timeline-subtitle timeline-subtitle-styled" :style="{ color: event.dotColor }">{{ event.subtitle }}</div>
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
              <div class="timeline-subtitle timeline-subtitle-styled" :style="{ color: event.dotColor }">{{ event.subtitle }}</div>
              <ul v-if="event.bullets && event.bullets.length" class="timeline-bullets">
                <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="timeline-meta">
              <span class="timeline-location">{{ event.location }}</span>
              <span>{{ event.dateRange }}</span>
              <span class="work-type">{{ event.type }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <hr class="section-separator" />

    <h2 class="section-heading academic">Education</h2>
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
              <span class="work-type">{{ event.type }}</span>
            </div>
          </template>
          <template v-else>
            <div class="timeline-card">
              <h3 class="timeline-title">{{ event.title }}</h3>
              <div class="timeline-subtitle" :style="{ color: event.dotColor, fontStyle: 'italic', fontWeight: 'bold' }">{{ event.subtitle }}</div>
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
              <div class="timeline-subtitle" :style="{ color: event.dotColor, fontStyle: 'italic', fontWeight: 'bold' }">{{ event.subtitle }}</div>
              <ul v-if="event.bullets && event.bullets.length" class="timeline-bullets">
                <li v-for="(bullet, i) in event.bullets" :key="i">{{ bullet }}</li>
              </ul>
            </div>
          </template>
          <template v-else>
            <div class="timeline-meta">
              <span>{{ event.location }}</span>
              <span>{{ event.dateRange }}</span>
              <span class="work-type">{{ event.type }}</span>
            </div>
          </template>
        </div>
      </div>
    </div>

    <hr class="section-separator" />

    <section class="skills-certs-section">
      <h2 class="section-heading skills-certs">Skills & Certifications</h2>
      <div class="content-area">
        <!-- Programming Languages (progress bars) -->
        <div class="skill-category">
          <h3 class="category-title">Programming Languages</h3>
          <ul class="skill-list-structured">
            <li v-for="skill in programmingLanguages" :key="skill.name" class="skill-item-structured">
              <span class="skill-name">{{ skill.name }}</span>
              <div class="skill-progress-info" v-if="skill.experience != null">
                <div class="skill-progress-bar-container" :title="`${skill.experience} years experience`">
                  <div class="skill-progress-bar-inner" :style="{ width: calculateExperienceWidth(skill.experience) }"></div>
                </div>
                <span class="skill-years">{{ skill.experience }} years</span>
              </div>
            </li>
          </ul>
        </div>
        <!-- Technical Skills (each category separated, horizontal, styled as <p>) -->
        <div v-for="cat in technicalCategories" :key="cat.title" class="skill-category">
          <h3 class="category-title">{{ cat.title }}</h3>
          <p class="tech-skill-list">{{ cat.skills.join(', ') }}</p>
        </div>
      </div>
    </section>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted } from 'vue';
import ButtonAnimation from '~/public/animations/Button.json';

const lottieAnimation = ref(null);

const downloadCV = () => {
  window.open('/CV/Ondrej_Dobis-CV-3_2025.pdf', '_blank');
};

const workEvents = [
  {
    title: 'Software developer ext.',
    subtitle: 'AiGency s.r.o.',
    location: 'Bratislava, Slovakia',
    dateRange: 'May 2025 – present',
    type: 'Part-time', // Added work type
    dotColor: '#4D4D4D',
    side: 'left',
    bullets: [
      'Scheduled web data extraction using Python',
      'Transforming legislative documents into vectorized formats for downstream analysis',
    ]
  },
  {
    title: 'IT Tester ext.',
    subtitle: 'InterWay, a. s',
    location: 'Bratislava, Slovakia',
    dateRange: 'Apr. 2024 – present',
    type: 'Full-time / Part-time', // Added work type
    dotColor: '#0063FB',
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
    subtitle: 'Sternula A/S ',
    location: 'Aalborg, Denmark',
    dateRange: 'Jul. 2022 – Jan. 2024',
    type: 'Part-time', // Added work type
    dotColor: '#F24405',
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
    type: 'Internship', // Added work type
    dotColor: '#4D98C7',
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
    type: 'Internship', // Added work type
    dotColor: '#4D4D4D',
    side: 'left',
    bullets: [
      'Developed Weather & Vessel Operation Prediction software using Vue.js, Nuxt.js, Python, .NET, TypeScript, and MongoDB for decision support in offshore wind turbine operations',
      'Created visualizations of asset performance based on historical data analysis',
      'Designed an intuitive dashboard for multiple stakeholders to support strategic decision-making'
    ]
  },
  {
    title: 'Project analyst, UI designer',
    subtitle: 'Nowire s.r.o',
    location: 'Bratislava, Slovakia',
    dateRange: 'Feb. 2021 – Aug. 2021',
    type: 'Part-time / Full-time', // Added work type
    dotColor: '#4D98C7',
    side: 'right',
    bullets: [
      'Conducted analytical activities including software requirements analysis, documentation, and user acceptance testing',
      'Created software design prototypes utilizing Angular components and Adobe Photoshop',
      'Redesigned company website using WordPress'
    ]
  },
  {
    title: 'Dishwasher,  Food courier,  Line cook',
    location: 'Denmark/ Slovakia',
    dateRange: '2019 – 2022',
    type: 'Part-time', // Added work type
    dotColor: '#ffffff',
    side: 'left',
  }
];

const academicEvents = [
  {
    title: 'Thomas More University of Applied Sciences',
    subtitle: 'University',
    location: 'Geel, Belgium',
    dateRange: '2024 – present',
    dotColor: '#D66A41', // Thomas More orange
    side: 'right',
    bullets: [
      'Java and .NET development, web development using PHP Laravel, data science with Python, business process management and ITIL, as well as artificial intelligence and machine learning.'
    ]
  },
  {
    title: 'Professionshøjskolen UCN',
    subtitle: 'University College',
    location: 'Aalborg, Denmark',
    dateRange: '2021 – 2024',
    dotColor: '#1E414F', // UCN green
    side: 'left',
    bullets: [
      'OOP and advanced programming techniques with Java & .NET, software design, business analysis, SQL, quality assurance (QA), integration testing, distributed systems and Agile methodologies.',
      'Final grade - 10'
    ]
  },
  {
    title: '1. súkromné gymnázium v Bratislave',
    subtitle: 'High school',
    location: 'Bratislava, Slovakia',
    dateRange: '2013 – 2021',
    dotColor: '#51A67F', // 1SG green
    side: 'right',
    bullets: [
      'Emphasis on language proficiency and specialized coursework in advanced mathematics and programming in Python.'
    ]
  },
];

const programmingLanguages = [
  { name: 'Python', experience: 6 },
  { name: 'Java', experience: 4.5 },
  { name: 'C# / .NET', experience: 3.5 },
  { name: 'JavaScript', experience: 3.5 },
  { name: 'SQL', experience: 3.5 },
  { name: 'TypeScript', experience: 3 },
  { name: 'PHP', experience: 1 }
];

const technicalCategories = [
  {
    title: 'Frameworks & Libraries',
    skills: ['Vue.js', 'Nuxt.js', 'React.js', 'Angular', 'Laravel', 'Selenide']
  },
  {
    title: 'Databases',
    skills: ['MongoDB', 'PostgreSQL', 'InfluxDB', 'MySQL', ]
  },
  {
    title: 'Tools & Platforms',
    skills: ['Git', 'Docker', 'Grafana', 'WordPress', 'Adobe Photoshop']
  },
  {
    title: 'Testing Concepts',
    skills: ['Manual Testing', 'Automated Testing', 'Integration Testing', 'UAT', 'E2E']
  },
  {
    title: 'Methodologies & Concepts',
    skills: ['UI/UX Design', 'Agile', 'Business Process Management', 'ITIL', 'Artificial Intelligence', 'Machine Learning']
  },
  {
    title: 'Soft Skills',
    skills: ['Hard working', 'Detail oriented', 'Creative', 'Analytical', 'Well organized', 'Trustworthy', 'Self-motivated', 'Self-managed', 'Committed']
  },
  {
    title: 'Certifications',
    skills: ['Studio Cambridge Certificate', 'Riviera English School Certificate', 'Cambridge English Flyers Certificate', 'UCN Employability Certificate', 'Oxford placement test - C1']
  }
];

const calculateExperienceWidth = (experience) => {
  const maxExperience = 6;
  const percentage = Math.min(100, Math.max(0, (experience / maxExperience) * 100));
  return `${percentage}%`;
};
</script>

<style scoped>
.cv-button-container {
  display: flex;
  justify-content: center;
  margin-bottom: 30px;
}

.cv-button {
  display: flex;
  flex-direction: column;
  align-items: center;
  cursor: pointer;
  transition: transform 0.2s ease-in-out;
}

.cv-button:hover {
  transform: translateY(-3px);
}

/* Fix for SVG height issue */
.cv-button svg {
  height: 0% !important;
}

.timeline-meta span {
  display: block; /* Ensure each span is on its own line */
}

.timeline-location {
  font-weight: bold; /* Highlight the location */
  margin-bottom: 5px; /* Space below location */
}

.work-type {
  font-style: italic;
  color: #888; /* Or any color that fits the design */
  margin-top: 5px; /* Space between date and type */
}
.timeline-subtitle-styled {
  font-style: italic;
  font-weight: bold;
}
@media (max-width: 768px) {
  .skills-certs-section .content-area {
    padding-left: 25px;
    padding-right: 25px;
  }

  .section-separator {
    margin-bottom: 15px; /* Reduce gap between academic history and skills */
  }

  .skills-certs-section {
    margin-top: 0px !important; /* Increase gap between programming languages and heading */
  }

}
</style>
