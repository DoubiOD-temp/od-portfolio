<template>
  <div ref="pageRef" class="resume-page">
    <div class="resume-shell">
      <aside class="systems-index resume-index">
        <p>Resume</p>
        <a
          href="#resume-work"
          @click="setActiveSectionFromNav('resume-work')"
          :class="{ active: activeSectionId === 'resume-work' }"
          :aria-current="activeSectionId === 'resume-work' ? 'location' : undefined"
        >
          Work experience
        </a>
        <a
          href="#resume-education"
          @click="setActiveSectionFromNav('resume-education')"
          :class="{ active: activeSectionId === 'resume-education' }"
          :aria-current="activeSectionId === 'resume-education' ? 'location' : undefined"
        >
          Education
        </a>
        <a
          href="#resume-skills"
          @click="setActiveSectionFromNav('resume-skills')"
          :class="{ active: activeSectionId === 'resume-skills' }"
          :aria-current="activeSectionId === 'resume-skills' ? 'location' : undefined"
        >
          Skills & Certifications
        </a>
        <button type="button" class="resume-download-button" @click="downloadCV">
          Download CV
        </button>
      </aside>

      <div class="resume-main">
        <section id="resume-work" class="resume-section">
          <h2 class="section-heading">Work experience</h2>
          <div class="timeline-outer">
      <div
        v-for="(event, idx) in workEvents"
        :key="'work-' + idx"
        class="timeline-row"
        :class="[event.side, getResumeEffect(idx) ? `motion-${getResumeEffect(idx).key}` : '']"
        :data-motion-effect="getResumeEffect(idx)?.key"
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
        </section>

    <hr class="section-separator" />

        <section id="resume-education" class="resume-section">
          <h2 class="section-heading academic">Education</h2>
          <div class="timeline-outer">
      <div
        v-for="(event, idx) in academicEvents"
        :key="'academic-' + idx"
        class="timeline-row"
        :class="[event.side, getResumeEffect(workEvents.length + idx) ? `motion-${getResumeEffect(workEvents.length + idx).key}` : '']"
        :data-motion-effect="getResumeEffect(workEvents.length + idx)?.key"
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
        </section>

    <hr class="section-separator" />

        <section id="resume-skills" class="skills-certs-section resume-section">
      <h2 class="section-heading skills-certs">Skills & Certifications</h2>
      <div class="content-area">
        <div class="skill-category programming-language-dock">
          <div class="programming-language-header">
            <h3 class="category-title">Programming Languages</h3>
            <p>Ranked by recent projects and production use · Programming since 2017</p>
          </div>
          <div class="language-dock" aria-label="Programming languages">
            <div class="language-dock-tier language-dock-tier-primary">
              <article
                v-for="language in primaryProgrammingLanguages"
                :key="language.name"
                class="language-dock-card primary"
              >
                <img class="language-dock-icon" :src="language.icon" :alt="`${language.name} logo`" loading="lazy" />
                <span>{{ language.name }}</span>
              </article>
            </div>
            <div class="language-dock-tier language-dock-tier-strong">
              <article
                v-for="language in strongProgrammingLanguages"
                :key="language.name"
                class="language-dock-card strong"
              >
                <img class="language-dock-icon" :src="language.icon" :alt="`${language.name} logo`" loading="lazy" />
                <span>{{ language.name }}</span>
              </article>
            </div>
          </div>
        </div>
        <!-- Technical Skills (each category separated, horizontal, styled as <p>) -->
        <div v-for="cat in technicalCategories" :key="cat.title" class="skill-category">
          <h3 class="category-title">{{ cat.title }}</h3>
          <p class="tech-skill-list">{{ cat.skills.join(', ') }}</p>
        </div>
      </div>
    </section>
      </div>
    </div>
  </div>
</template>

<script setup>
import { ref, computed, onMounted, onUnmounted, nextTick } from 'vue';
import { gsap } from 'gsap';
import { ScrollTrigger } from 'gsap/ScrollTrigger';

if (import.meta.client) {
  gsap.registerPlugin(ScrollTrigger);
  gsap.defaults({ overwrite: 'auto', ease: 'power2.out' });
  gsap.ticker.lagSmoothing(0);
}

const lottieAnimation = ref(null);
const scrollTriggers = ref([]);
const pageRef = ref(null);
const sectionIds = ['resume-work', 'resume-education', 'resume-skills'];
const activeSectionId = ref('');
let activeSectionFrame = 0;
let onLoadRefresh = null;

const showcaseEffects = [
  { key: 'cinema-mask' },
  { key: 'prism-lift' },
  { key: 'editorial-fold' },
  { key: 'signal-scan' },
  { key: 'cinema-mask' },
  { key: 'prism-lift' },
  { key: 'editorial-fold' },
  { key: 'signal-scan' },
];

const getResumeEffect = (idx) => showcaseEffects[idx] ?? null;

const downloadCV = () => {
  window.open('/CV/Dobis_CV_0626.pdf', '_blank');
};

const isMobile = () => window.innerWidth <= 900;

const getActiveSectionOffset = () => {
  const firstSection = document.getElementById(sectionIds[0]);
  const index = document.querySelector('.resume-index');
  const scrollMarginTop = firstSection
    ? parseFloat(window.getComputedStyle(firstSection).scrollMarginTop) || 0
    : 0;
  const stickyTop = index
    ? parseFloat(window.getComputedStyle(index).top) || 0
    : 0;

  return Math.max(scrollMarginTop, stickyTop, 1);
};

const updateActiveSection = () => {
  if (!pageRef.value) return;

  const markerOffset = getActiveSectionOffset();
  const scrollTop = Math.max(
    window.scrollY,
    document.documentElement.scrollTop,
    document.body.scrollTop,
  );
  const documentHeight = Math.max(
    document.body.scrollHeight,
    document.documentElement.scrollHeight,
  );
  const bottomTolerance = 8;
  const isAtPageBottom = scrollTop + window.innerHeight >= documentHeight - bottomTolerance;
  const sections = sectionIds
    .map((sectionId) => {
      const section = document.getElementById(sectionId);

      if (!section) return null;

      return {
        id: sectionId,
        top: section.getBoundingClientRect().top,
      };
    })
    .filter(Boolean);

  if (!sections.length) return;

  let nextSection = sections[0].id;

  if (isAtPageBottom) {
    nextSection = sections[sections.length - 1].id;
  } else {
    for (const section of sections) {
      if (section.top > markerOffset) {
        break;
      }
      nextSection = section.id;
    }
  }

  activeSectionId.value = nextSection;
};

const setActiveSectionFromNav = (sectionId) => {
  activeSectionId.value = sectionId;
};

const scheduleActiveSectionUpdate = () => {
  if (activeSectionFrame) return;

  activeSectionFrame = window.requestAnimationFrame(() => {
    activeSectionFrame = 0;
    updateActiveSection();
  });
};

const handleHashChange = () => {
  const hashSectionId = window.location.hash.slice(1);

  if (sectionIds.includes(hashSectionId)) {
    setActiveSectionFromNav(hashSectionId);
    return;
  }

  scheduleActiveSectionUpdate();
};

onMounted(async () => {
  await nextTick();

  const reduced =
    typeof window !== 'undefined' &&
    window.matchMedia &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const mobile = isMobile();
  const scrollStart = mobile ? 'top 92%' : 'top 85%';
  const settleEase = 'expo.out';

  const buildShowcaseTimeline = ({ row, card, dot, isRight, effect }) => {
    const title = card.querySelector('.timeline-title');
    const subtitle = card.querySelector('.timeline-subtitle');
    const bullets = card.querySelectorAll('.timeline-bullets li');
    const contentTargets = [title, subtitle, ...bullets].filter(Boolean);
    const xDirection = mobile ? 1 : isRight ? -1 : 1;

    gsap.set(dot, { opacity: 0, scale: 0.35, '--ring': 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: scrollStart, toggleActions: 'play none none none' },
    });

    tl.to(dot, { opacity: 1, scale: 1, duration: 0.58, ease: 'expo.out' }, 0)
      .fromTo(dot, { '--ring': 0 }, { '--ring': 1, duration: 0.9, ease: 'power2.out' }, 0.02);

    if (effect === 'cinema-mask') {
      gsap.set(card, {
        opacity: 0,
        y: 34,
        scale: 0.975,
        filter: 'blur(14px)',
      });
      gsap.set(contentTargets, { opacity: 0, y: 16, filter: 'blur(7px)' });

      tl.to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.9,
          ease: settleEase,
        },
        0.08,
      )
        .to(contentTargets, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.58, stagger: 0.055, ease: 'power3.out' }, 0.36);
    } else if (effect === 'prism-lift') {
      gsap.set(card, {
        opacity: 0,
        x: xDirection * 32,
        y: 24,
        scale: 0.965,
        rotateY: mobile ? 0 : xDirection * -12,
        rotateZ: xDirection * 0.6,
        filter: 'blur(12px)',
        transformOrigin: `${isRight || mobile ? 'left' : 'right'} center`,
        transformPerspective: 1200,
      });
      gsap.set(contentTargets, { opacity: 0, x: xDirection * 12, filter: 'blur(6px)' });

      tl.to(
        card,
        {
          opacity: 1,
          x: 0,
          y: 0,
          scale: 1,
          rotateY: 0,
          rotateZ: 0,
          filter: 'blur(0px)',
          duration: 0.96,
          ease: settleEase,
        },
        0.08,
      )
        .to(contentTargets, { opacity: 1, x: 0, filter: 'blur(0px)', duration: 0.5, stagger: 0.045, ease: 'power3.out' }, 0.42);
    } else if (effect === 'editorial-fold') {
      gsap.set(card, {
        opacity: 0,
        y: -22,
        scale: 0.985,
        filter: 'blur(10px)',
        transformOrigin: 'top center',
      });
      gsap.set(title, { opacity: 0, y: -16, filter: 'blur(7px)' });
      gsap.set([subtitle, ...bullets].filter(Boolean), { opacity: 0, y: 12, filter: 'blur(5px)' });

      tl.to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          filter: 'blur(0px)',
          duration: 0.82,
          ease: 'power4.out',
        },
        0.1,
      )
        .to(title, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.62, ease: settleEase }, 0.3)
        .to([subtitle, ...bullets].filter(Boolean), { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.48, stagger: 0.04, ease: 'power3.out' }, 0.46);
    } else {
      gsap.set(card, {
        opacity: 0,
        y: 48,
        scale: 0.94,
        rotateX: mobile ? 0 : 9,
        filter: 'blur(16px)',
        transformPerspective: 1000,
      });
      gsap.set(contentTargets, { opacity: 0, y: 10, filter: 'blur(5px)' });

      tl.to(
        card,
        {
          opacity: 1,
          y: 0,
          scale: 1,
          rotateX: 0,
          filter: 'blur(0px)',
          duration: 0.98,
          ease: settleEase,
        },
        0.1,
      )
        .to(contentTargets, { opacity: 1, y: 0, filter: 'blur(0px)', duration: 0.54, stagger: 0.04, ease: 'power2.out' }, 0.44);
    }

    return tl;
  };

  // --- Timeline rows: dot pings, card extrudes from the spine, contents settle ---
  document.querySelectorAll('.timeline-row').forEach((row) => {
    const isRight = row.classList.contains('right');
    const card = row.querySelector('.timeline-card');
    const dot = row.querySelector('.timeline-dot-simple');
    if (!card || !dot) return;

    const dotColor = getComputedStyle(dot).backgroundColor;
    dot.style.setProperty('--ring-color', dotColor);
    const effect = row.dataset.motionEffect;

    if (reduced) {
      gsap.set([card, dot], { opacity: 0 });
      const tween = gsap.to([card, dot], {
        opacity: 1,
        duration: 0.5,
        ease: 'power2.out',
        scrollTrigger: { trigger: row, start: scrollStart, toggleActions: 'play none none none' },
      });
      scrollTriggers.value.push(tween.scrollTrigger);
      return;
    }

    if (effect) {
      const tl = buildShowcaseTimeline({ row, card, dot, isRight, effect });
      scrollTriggers.value.push(tl.scrollTrigger);
      return;
    }

    const originX = mobile ? 'left' : isRight ? 'left' : 'right';
    const rotY = mobile ? 12 : 22;
    const xOffset = mobile ? 12 : 18;
    const contentTargets = card.querySelectorAll('.timeline-title, .timeline-subtitle, .timeline-bullets li');

    gsap.set(card, {
      opacity: 0,
      scaleX: 0.7,
      rotateY: isRight ? -rotY : rotY,
      x: isRight ? -xOffset : xOffset,
      filter: 'blur(10px)',
      transformOrigin: `${originX} center`,
      transformPerspective: 800,
    });
    gsap.set(contentTargets, { opacity: 0, y: 6 });
    gsap.set(dot, { opacity: 0, scale: 0, '--ring': 0 });

    const tl = gsap.timeline({
      scrollTrigger: { trigger: row, start: scrollStart, toggleActions: 'play none none none' },
    });

    tl.to(dot, { opacity: 1, scale: 1, duration: 0.55, ease: 'elastic.out(1, 0.45)' }, 0)
      .fromTo(dot, { '--ring': 0 }, { '--ring': 1, duration: 0.75, ease: 'power2.out' }, 0)
      .to(
        card,
        {
          opacity: 1,
          scaleX: 1,
          rotateY: 0,
          x: 0,
          filter: 'blur(0px)',
          duration: 0.65,
          ease: 'back.out(1.4)',
        },
        0.08,
      )
      .to(contentTargets, { opacity: 1, y: 0, duration: 0.35, stagger: 0.04, ease: 'power3.out' }, 0.42);

    scrollTriggers.value.push(tl.scrollTrigger);
  });

  const languageCards = gsap.utils.toArray('.language-dock-card');
  if (languageCards.length) {
    if (reduced) {
      gsap.set(languageCards, { opacity: 1, y: 0, scale: 1 });
    } else {
      gsap.set(languageCards, { opacity: 0, y: 28, scale: 0.96 });
      const tween = gsap.to(languageCards, {
        opacity: 1,
        y: 0,
        scale: 1,
        duration: 0.75,
        stagger: 0.075,
        ease: 'back.out(1.18)',
        scrollTrigger: {
          trigger: '.programming-language-dock',
          start: scrollStart,
          toggleActions: 'play none none none',
        },
      });
      scrollTriggers.value.push(tween.scrollTrigger);
    }
  }

  // Recalculate trigger positions once initial paint settles and on full load
  ScrollTrigger.addEventListener('refresh', scheduleActiveSectionUpdate);
  ScrollTrigger.refresh();
  onLoadRefresh = () => ScrollTrigger.refresh();
  window.addEventListener('load', onLoadRefresh, { once: true });
  updateActiveSection();
  window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });
  document.body.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });
  document.documentElement.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleActiveSectionUpdate);
  window.addEventListener('hashchange', handleHashChange);
});

onUnmounted(() => {
  window.removeEventListener('scroll', scheduleActiveSectionUpdate);
  document.body.removeEventListener('scroll', scheduleActiveSectionUpdate);
  document.documentElement.removeEventListener('scroll', scheduleActiveSectionUpdate);
  window.removeEventListener('resize', scheduleActiveSectionUpdate);
  window.removeEventListener('hashchange', handleHashChange);
  if (onLoadRefresh) {
    window.removeEventListener('load', onLoadRefresh);
    onLoadRefresh = null;
  }
  ScrollTrigger.removeEventListener('refresh', scheduleActiveSectionUpdate);
  if (activeSectionFrame) {
    window.cancelAnimationFrame(activeSectionFrame);
    activeSectionFrame = 0;
  }
  scrollTriggers.value.forEach((st) => st?.kill());
  scrollTriggers.value = [];
});

const workEvents = [
  {
    title: 'Software developer intern',
    subtitle: 'Aigency',
    location: 'Bratislava, Slovakia',
    dateRange: 'Feb. 2026 – Jun. 2026',
    type: 'Internship', // Added work type
    dotColor: '#3AB892',
    side: 'left',
    bullets: [
      'Contributed to LectureGuru, an AI platform for training presentations, browser-based decks, narrated videos, quizzes, and exports',
      'Built workspace, source management, AI clarification, interactive slide, and editor tooling features',
      'Extended decks with charts, images, voiceovers, quiz slides, themes, and assistant-driven editing',
      'Improved PDF/video exports, background jobs, storage links, credits, validation, authorization, edge cases, and Slovak-English localization'
    ]
  },
  {
    title: 'IT Tester ext.',
    subtitle: 'InterWay, a. s',
    location: 'Bratislava, Slovakia',
    dateRange: 'Apr. 2024 – Aug. 2025',
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
      'Java and .NET development, web development using PHP Laravel, data science with Python, business process management and ITIL, as well as machine learning and deep learning.'
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

const primaryProgrammingLanguages = [
  { name: 'TypeScript', icon: '/images/languages/typescript.png' },
  { name: 'JavaScript', icon: '/images/languages/javascript.png' },
  { name: 'Python', icon: '/images/languages/python.png' },
  { name: 'Java', icon: '/images/languages/java.png' },
];

const strongProgrammingLanguages = [
  { name: 'C#', icon: '/images/languages/csharp.png' },
  { name: 'PHP', icon: '/images/languages/php.png' },
];


const technicalCategories = [
  {
    title: 'Frameworks & Libraries',
    skills: ['Vue.js', 'Nuxt.js', 'Next.js', 'React.js', 'Angular', 'Laravel', 'LiveWire', '.NET', 'ASP.NET MVC', 'Entity framework', 'ADO.NET', 'Drizzle ORM', 'Vercel AI SDK', 'GSAP', 'Pinia', 'Chart.js', 'Alpine.js', 'Liquid', 'Flask']
  },
  {
    title: 'Databases & Storage',
    skills: ['PostgreSQL', 'Supabase', 'MongoDB', 'MySQL', 'SQL Server', 'InfluxDB', 'Amazon S3', 'Cloudflare R2']
  },
  {
    title: 'Tools & Platforms',
    skills: ['Git', 'Docker', 'Node.js', 'Bun', 'Tomcat', 'Vercel', 'DigitalOcean', 'Grafana', 'WordPress', 'Adobe Photoshop']
  },
  {
    title: 'Testing & QA',
    skills: ['Unit Testing', 'Integration Testing', 'E2E', 'UAT', 'Selenium', 'Selenide']
  },
  {
    title: 'Methodologies & Concepts',
    skills: ['Artificial Intelligence', 'Machine Learning', 'Computer Vision', 'UI/UX Design', 'Agile', 'Business Process Management', 'ITIL']
  },
  {
    title: 'Soft Skills',
    skills: ['Analytical problem-solving', 'Root-cause analysis', 'Attention to detail', 'Cross-functional collaboration', 'Initiative & ownership', 'Adaptability', 'Continuous learning', 'Reliability']
  },
  {
    title: 'Certifications',
    skills: ['Studio Cambridge Certificate', 'Riviera English School Certificate', 'Cambridge English Flyers Certificate', 'UCN Employability Certificate', 'Oxford placement test - C1']
  }
];

</script>

<style src="~/assets/css/timeline.css"></style>

<style scoped>
.resume-page {
  --ink: #202633;
  --muted: #667085;
  --line: #dfe6ef;
  --accent: #2563eb;
  --accent-2: #0f9f6e;
  background: #fff;
  color: var(--ink);
  min-height: 100vh;
  padding: 2rem 24px 80px;
}

.resume-shell {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 10px;
  max-width: 1280px;
  margin: 0 auto;
}

.resume-main {
  min-width: 0;
}

.resume-section {
  scroll-margin-top: 5rem;
  margin-top: 0rem !important;
}

.resume-section:first-child .section-heading {
  margin-top: 3rem;
}

.systems-index {
  position: sticky;
  top: 50vh;
  align-self: start;
  display: grid;
  gap: 14px;
  border-left: 1px solid var(--line);
  font-family: 'Sora', 'Arial', sans-serif;
  padding-left: 18px;
  transform: translateY(-50%);
}

.systems-index p {
  color: #222;
  margin: 0 0 12px;
}

.systems-index a {
  color: #222;
  position: relative;
  text-decoration: none;
  transform: translateX(0);
  transition: color 200ms ease, transform 200ms ease;
}

.systems-index a::before {
  content: '';
  position: absolute;
  top: 50%;
  left: -19px;
  width: 2px;
  height: 22px;
  border-radius: 999px;
  background: linear-gradient(180deg, var(--accent), var(--accent-2));
  opacity: 0;
  transform: translateY(-50%) scaleY(0.35);
  transform-origin: center;
  transition: opacity 200ms ease, transform 200ms ease;
}

.systems-index p,
.systems-index a {
  font-size: 1rem;
  font-weight: 400;
  letter-spacing: 0.02em;
  line-height: normal;
}

.systems-index a:hover {
  color: #4D63BB;
}

.systems-index a.active {
  color: var(--accent);
  font-weight: 700;
  transform: translateX(6px);
}

.systems-index a.active::before {
  opacity: 1;
  transform: translateY(-50%) scaleY(1);
}

.resume-download-button {
  appearance: none;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: fit-content;
  min-height: 40px;
  border: 1px solid #111;
  border-radius: 999px;
  background: #111;
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1;
  margin-top: 10px;
  padding: 0.7rem 1.25rem;
  transition: transform 0.15s ease, background-color 0.15s ease;
}

.resume-download-button:hover {
  background: #000;
  transform: translateY(-2px);
}

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

/* Prevent flash before GSAP sets initial state */
:deep(.timeline-card) {
  will-change: transform, opacity;
}

@media (max-width: 1100px) {
  .resume-shell {
    grid-template-columns: 1fr;
    gap: 42px;
  }

  .resume-index {
    display: none;
  }
}

@media (max-width: 768px) {
  .resume-page {
    padding: 2rem 16px 56px;
  }

  .resume-section:first-child .section-heading {
    margin-top: 15px;
    padding-top: 25px;
  }

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
