<template>
  <div ref="pageRef" class="internship-page">
    <section class="internship-variant-shell" aria-label="Internship realization page">
      <div class="variant-toolbar">
      </div>

      <article class="variant variant-systems">
        <aside class="systems-index">
          <p>LectureGuru</p>
          <a
            href="#systems-evolution"
            :class="{ active: activeSectionId === 'systems-evolution' }"
            :aria-current="activeSectionId === 'systems-evolution' ? 'location' : undefined"
          >
            Product evolution
          </a>
          <a
            href="#systems-abstract"
            :class="{ active: activeSectionId === 'systems-abstract' }"
            :aria-current="activeSectionId === 'systems-abstract' ? 'location' : undefined"
          >
            Abstract
          </a>
          <a
            href="#systems-presentation"
            :class="{ active: activeSectionId === 'systems-presentation' }"
            :aria-current="activeSectionId === 'systems-presentation' ? 'location' : undefined"
          >
            Presentation
          </a>
          <a
            href="#systems-map"
            :class="{ active: activeSectionId === 'systems-map' }"
            :aria-current="activeSectionId === 'systems-map' ? 'location' : undefined"
          >
            Built features
          </a>
          <a
            href="#systems-gallery"
            :class="{ active: activeSectionId === 'systems-gallery' }"
            :aria-current="activeSectionId === 'systems-gallery' ? 'location' : undefined"
          >
            Gallery
          </a>
          <a
            href="#systems-stack"
            :class="{ active: activeSectionId === 'systems-stack' }"
            :aria-current="activeSectionId === 'systems-stack' ? 'location' : undefined"
          >
            Workstreams
          </a>
          <a
            href="#systems-impact"
            :class="{ active: activeSectionId === 'systems-impact' }"
            :aria-current="activeSectionId === 'systems-impact' ? 'location' : undefined"
          >
            Impact
          </a>

          <div class="internship-download-actions" aria-label="Internship downloads">
            <a
              v-for="doc in internshipDocuments"
              :key="doc.href"
              class="internship-button"
              :class="doc.primary ? 'internship-button-primary' : 'internship-button-secondary'"
              :href="doc.href"
              target="_blank"
              rel="noopener"
            >
              <span>{{ doc.label }}</span>
              <svg class="internship-download-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v10"></path>
                <path d="m8 10 4 4 4-4"></path>
                <path d="M5 19h14"></path>
              </svg>
            </a>
          </div>
        </aside>

        <div class="systems-main">
          <header class="systems-hero scroll-scene scene-hero">
            <p class="eyebrow">Aigency · LectureGuru</p>
            <h2>From source material to interactive training content.</h2>
            <p>
              During my internship at Aigency, a company focused on web AI platforms and product-facing automation, I worked on LectureGuru: an AI platform
              for turning ideas and source materials into training presentations, narrated videos, PDFs, and browser-based learning materials. The work focused
              on making generated content easier to edit, export, share, and use inside real teams.
            </p>
          </header>

          <div class="internship-download-actions internship-mobile-downloads" aria-label="Internship downloads">
            <a
              v-for="doc in internshipDocuments"
              :key="`mobile-${doc.href}`"
              class="internship-button"
              :class="doc.primary ? 'internship-button-primary' : 'internship-button-secondary'"
              :href="doc.href"
              target="_blank"
              rel="noopener"
            >
              <span>{{ doc.label }}</span>
              <svg class="internship-download-icon" viewBox="0 0 24 24" aria-hidden="true">
                <path d="M12 4v10"></path>
                <path d="m8 10 4 4 4-4"></path>
                <path d="M5 19h14"></path>
              </svg>
            </a>
          </div>

          <section id="systems-evolution" class="product-evolution scroll-scene">
            <div class="section-heading">
              <p class="section-label">Product evolution</p>
              <h3>From generated files to a complete learning workspace.</h3>
            </div>
            <div class="evolution-grid">
              <div v-for="column in productEvolution" :key="column.title" class="evolution-column">
                <span>{{ column.label }}</span>
                <h4>{{ column.title }}</h4>
                <ul>
                  <li v-for="item in column.items" :key="item">{{ item }}</li>
                </ul>
              </div>
            </div>
          </section>

          <section id="systems-abstract" class="systems-abstract scroll-scene scene-abstract">
            <div class="abstract-number">
              <strong>16</strong>
              <span>weeks</span>
            </div>
            <p>
              The internship focused on turning generated training content into a complete workspace for creating, editing, sharing, exporting, and localizing
              learning materials. The project implemented structured workspaces, interactive presentations, an editing environment, export pipelines,
              multilingual interfaces, and a Custom AI generation path for LectureGuru.
            </p>
          </section>

          <section id="systems-presentation" class="live-presentation scroll-scene">
            <div class="live-presentation-heading">
              <div>
                <p class="section-label">Public presentation</p>
                <h3>Example presentation, published as a LectureGuru deck.</h3>
              </div>
              <a
                :href="presentationLink"
                class="internship-button internship-button-primary internship-presentation-link"
                target="_blank"
                rel="noopener noreferrer"
              >
                <span>Open in new tab</span>
                <svg class="internship-download-icon internship-external-link-icon" viewBox="0 0 24 24" aria-hidden="true">
                  <path d="M15 3h6v6"></path>
                  <path d="M10 14 21 3"></path>
                  <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6"></path>
                </svg>
              </a>
            </div>
            <div ref="presentationPreviewRef" class="presentation-frame">
              <button
                type="button"
                class="presentation-nav presentation-nav-prev"
                aria-label="Previous slide"
                @click="navigatePresentation(-1)"
              >
                ‹
              </button>
              <iframe
                ref="presentationFrameRef"
                :src="presentationEmbedLink"
                title="LectureGuru internship presentation"
                loading="lazy"
                allow="fullscreen; autoplay"
                referrerpolicy="strict-origin-when-cross-origin"
                sandbox="allow-scripts allow-forms allow-presentation allow-same-origin"
              ></iframe>
              <button
                type="button"
                class="presentation-nav presentation-nav-next"
                aria-label="Next slide"
                @click="navigatePresentation(1)"
              >
                ›
              </button>
            </div>
          </section>

          <section id="systems-map" class="systems-map scroll-scene">
            <div class="section-heading">
              <p class="section-label">Built features</p>
              <h3>Product areas I helped build and improve.</h3>
            </div>
            <div class="systems-map-grid">
              <article v-for="system in shippedSystems" :key="system.title" class="system-node">
                <span>{{ system.index }}</span>
                <h4>{{ system.title }}</h4>
                <p>{{ system.body }}</p>
              </article>
            </div>
          </section>

          <section id="systems-gallery" class="scroll-scene scene-gallery">
            <GalleryShowcase mode="systems" />
          </section>

          <section id="systems-stack" class="systems-matrix scroll-scene scene-matrix">
            <div v-for="item in workstreams" :key="item.title" class="matrix-row">
              <span>{{ item.index }}</span>
              <strong>{{ item.title }}</strong>
              <p>{{ item.body }}</p>
            </div>
          </section>

          <section id="systems-impact" class="impact-lessons scroll-scene">
            <div class="section-heading">
              <p class="section-label">Outcome</p>
              <h3>What the work made possible.</h3>
            </div>
            <div class="impact-grid">
              <article v-for="section in impactLessons" :key="section.title" class="impact-column">
                <h4>{{ section.title }}</h4>
                <ul>
                  <li v-for="item in section.items" :key="item">{{ item }}</li>
                </ul>
              </article>
            </div>
          </section>
        </div>
      </article>
    </section>
  </div>
</template>

<script setup lang="ts">
import { computed, defineComponent, h, nextTick, onBeforeUnmount, onMounted, ref } from 'vue';

const failedImages = ref(new Set<string>());
const pageRef = ref<HTMLElement | null>(null);
const presentationPreviewRef = ref<HTMLElement | null>(null);
const presentationFrameRef = ref<HTMLIFrameElement | null>(null);
const internshipDocuments = [
  {
    label: 'Realization doc.',
    href: '/internship-docs/Dobis_Realization_Document.pdf',
    primary: true,
  },
  {
    label: 'Project Plan',
    href: '/internship-docs/Project_plan.pdf',
    primary: false,
  },
  {
    label: 'Reflection',
    href: '/internship-docs/Dobis_reflection.pdf',
    primary: false,
  },
];
const sectionIds = [
  'systems-abstract',
  'systems-evolution',
  'systems-presentation',
  'systems-map',
  'systems-gallery',
  'systems-stack',
  'systems-impact',
] as const;
type SectionId = (typeof sectionIds)[number];
const activeSectionId = ref<SectionId | ''>('');

let activeSectionFrame = 0;
let scrollContext: { revert: () => void } | null = null;
let presentationResizeObserver: ResizeObserver | null = null;

const MOBILE_PRESENTATION_BREAKPOINT = '(max-width: 720px)';
const MOBILE_PRESENTATION_VIRTUAL_WIDTH = 1200;
const MOBILE_PRESENTATION_VIRTUAL_HEIGHT = 675;

const presentationLink = 'https://app.lecture-guru.com/slides/733789c4ee7b';
const presentationEmbedLink = '/lectureguru-embed/slides/733789c4ee7b';

const clearMobilePresentationScale = () => {
  const preview = presentationPreviewRef.value;

  if (!preview) {
    return;
  }

  preview.style.removeProperty('--presentation-mobile-width');
  preview.style.removeProperty('--presentation-mobile-height');
  preview.style.removeProperty('--presentation-mobile-scale');
};

const updateMobilePresentationScale = () => {
  const preview = presentationPreviewRef.value;

  if (!preview) {
    return;
  }

  if (!window.matchMedia(MOBILE_PRESENTATION_BREAKPOINT).matches) {
    clearMobilePresentationScale();
    return;
  }

  const frameWidth = preview.clientWidth;

  if (!frameWidth) {
    return;
  }

  preview.style.setProperty('--presentation-mobile-width', `${MOBILE_PRESENTATION_VIRTUAL_WIDTH}px`);
  preview.style.setProperty('--presentation-mobile-height', `${MOBILE_PRESENTATION_VIRTUAL_HEIGHT}px`);
  preview.style.setProperty('--presentation-mobile-scale', `${frameWidth / MOBILE_PRESENTATION_VIRTUAL_WIDTH}`);
};

const navigatePresentation = (direction: number) => {
  presentationFrameRef.value?.contentWindow?.postMessage(
    { type: 'slide-navigate', direction },
    window.location.origin
  );
};

const updateActiveSection = () => {
  if (!pageRef.value) {
    return;
  }

  const marker = Math.min(window.innerHeight * 0.38, 280);
  let nextSection: SectionId | '' = '';

  for (const sectionId of sectionIds) {
    const section = document.getElementById(sectionId);

    if (!section) {
      continue;
    }

    const rect = section.getBoundingClientRect();

    if (rect.top <= marker && rect.bottom > marker) {
      nextSection = sectionId;
      break;
    }

    if (rect.top <= marker) {
      nextSection = sectionId;
    }
  }

  activeSectionId.value = nextSection;
};

const scheduleActiveSectionUpdate = () => {
  if (activeSectionFrame) {
    return;
  }

  activeSectionFrame = window.requestAnimationFrame(() => {
    activeSectionFrame = 0;
    updateActiveSection();
  });
};

const setupScrollTransitions = async () => {
  await nextTick();

  const root = pageRef.value;
  const prefersReducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  if (!root || prefersReducedMotion) {
    return;
  }

  const [{ gsap }, { ScrollTrigger }] = await Promise.all([
    import('gsap'),
    import('gsap/ScrollTrigger'),
  ]);

  if (!pageRef.value) {
    return;
  }

  gsap.registerPlugin(ScrollTrigger);

  scrollContext = gsap.context(() => {
    const revealEase = 'power3.out';
    const scrubEase = 'none';
    const isMobileLayout = window.matchMedia('(max-width: 720px)').matches;

    const hero = root.querySelector<HTMLElement>('.scene-hero');
    if (hero) {
      const heroParts = Array.from(hero.querySelectorAll<HTMLElement>('.eyebrow, h2, p'));
      const heroTitle = hero.querySelector<HTMLElement>('h2');

      gsap.fromTo(
        heroParts,
        { autoAlpha: 0, y: 36, filter: 'blur(16px)' },
        {
          autoAlpha: 1,
          y: 0,
          filter: 'blur(0px)',
          ease: revealEase,
          stagger: 0.12,
          scrollTrigger: {
            trigger: hero,
            start: 'top 82%',
            end: 'top 28%',
            scrub: 0.9,
          },
        }
      );

      if (heroTitle) {
        gsap.to(heroTitle, {
          scale: 0.965,
          xPercent: -2,
          transformOrigin: 'left center',
          ease: scrubEase,
          scrollTrigger: {
            trigger: hero,
            start: 'top top+=96',
            end: 'bottom top',
            scrub: true,
          },
        });
      }
    }

    const abstract = root.querySelector<HTMLElement>('.scene-abstract');
    if (abstract) {
      const abstractNumber = abstract.querySelector<HTMLElement>('.abstract-number');
      const abstractBody = abstract.querySelector<HTMLElement>('p');

      gsap.fromTo(
        abstract,
        { '--abstract-scan': 0 },
        {
          '--abstract-scan': 1,
          ease: scrubEase,
          scrollTrigger: {
            trigger: abstract,
            start: 'top 76%',
            end: 'bottom 44%',
            scrub: 0.8,
          },
        }
      );

      if (abstractNumber) {
        gsap.fromTo(
          abstractNumber,
          { autoAlpha: 0, y: 42, scale: 0.64, rotateX: -32, filter: 'blur(12px)' },
          {
            autoAlpha: 1,
            y: 0,
            scale: 1,
            rotateX: 0,
            filter: 'blur(0px)',
            ease: 'back.out(1.25)',
            scrollTrigger: {
              trigger: abstract,
              start: 'top 82%',
              end: 'top 36%',
              scrub: 0.7,
            },
          }
        );
      }

      if (abstractBody) {
        gsap.fromTo(
          abstractBody,
          { autoAlpha: 0, x: 84, filter: 'blur(10px)' },
          {
            autoAlpha: 1,
            x: 0,
            filter: 'blur(0px)',
            ease: revealEase,
            scrollTrigger: {
              trigger: abstract,
              start: 'top 78%',
              end: 'top 34%',
              scrub: 0.85,
            },
          }
        );
      }
    }

    const gallery = root.querySelector<HTMLElement>('.scene-gallery');
    if (gallery && !isMobileLayout) {
      const galleryHeading = gallery.querySelector<HTMLElement>('.gallery-heading');
      const galleryTrack = gallery.querySelector<HTMLElement>('.gallery-track');
      const galleryCards = Array.from(gallery.querySelectorAll<HTMLElement>('.screenshot-card'));

	      if (galleryHeading) {
	        gsap.fromTo(
	          galleryHeading,
	          { autoAlpha: 0, x: -52, filter: 'blur(10px)' },
	          {
	            autoAlpha: 1,
	            x: 0,
	            filter: 'blur(0px)',
	            ease: revealEase,
            scrollTrigger: {
              trigger: gallery,
              start: 'top 76%',
              end: 'top 38%',
              scrub: 0.9,
            },
          }
        );
      }

	      if (galleryCards.length) {
	        gsap.fromTo(
	          galleryCards,
	          {
	            autoAlpha: 0,
	            x: (index: number) => (index % 2 ? 38 : -38),
	            filter: 'blur(8px)',
	          },
	          {
	            autoAlpha: 1,
	            x: 0,
	            filter: 'blur(0px)',
	            ease: revealEase,
	            stagger: 0.08,
	            scrollTrigger: {
              trigger: gallery,
              start: 'top 72%',
              end: 'center 48%',
              scrub: 1,
            },
          }
        );
      }

      if (galleryTrack) {
        gsap.to(galleryTrack, {
          x: () => (window.innerWidth > 720 ? -90 : -24),
          ease: scrubEase,
          scrollTrigger: {
            trigger: gallery,
            start: 'top bottom',
            end: 'bottom top',
            scrub: 1.2,
            invalidateOnRefresh: true,
          },
        });
      }
    }

    const matrix = root.querySelector<HTMLElement>('.scene-matrix');
    if (matrix) {
      const rows = Array.from(matrix.querySelectorAll<HTMLElement>('.matrix-row'));

      gsap.fromTo(
        matrix,
        { '--matrix-scan': '-110%' },
        {
          '--matrix-scan': '110%',
          ease: scrubEase,
          scrollTrigger: {
            trigger: matrix,
            start: 'top 76%',
            end: 'bottom 42%',
            scrub: 0.8,
          },
        }
      );

      if (rows.length) {
        gsap.fromTo(
          rows,
          {
            autoAlpha: 0,
            x: (index: number) => (index % 2 ? 68 : -68),
            skewX: (index: number) => (index % 2 ? -3 : 3),
            filter: 'blur(8px)',
          },
          {
            autoAlpha: 1,
            x: 0,
            skewX: 0,
            filter: 'blur(0px)',
            ease: revealEase,
            stagger: 0.1,
            scrollTrigger: {
              trigger: matrix,
              start: 'top 78%',
              end: 'center 38%',
              scrub: 0.95,
            },
          }
        );
      }
    }

    requestAnimationFrame(() => ScrollTrigger.refresh());
  }, root);
};

onMounted(async () => {
  updateMobilePresentationScale();
  presentationResizeObserver = new ResizeObserver(updateMobilePresentationScale);

  if (presentationPreviewRef.value) {
    presentationResizeObserver.observe(presentationPreviewRef.value);
  }

  updateActiveSection();
  window.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });
  document.body.addEventListener('scroll', scheduleActiveSectionUpdate, { passive: true });
  window.addEventListener('resize', scheduleActiveSectionUpdate);
  window.addEventListener('resize', updateMobilePresentationScale);

  await setupScrollTransitions();
});

onBeforeUnmount(() => {
  window.removeEventListener('scroll', scheduleActiveSectionUpdate);
  document.body.removeEventListener('scroll', scheduleActiveSectionUpdate);
  window.removeEventListener('resize', scheduleActiveSectionUpdate);
  window.removeEventListener('resize', updateMobilePresentationScale);
  presentationResizeObserver?.disconnect();
  presentationResizeObserver = null;
  clearMobilePresentationScale();

  if (activeSectionFrame) {
    window.cancelAnimationFrame(activeSectionFrame);
  }

  scrollContext?.revert();
  scrollContext = null;
});

const screenshots = [
  {
    title: 'Slide editor',
    caption: 'Interactive slide editing with canvas preview, slide rail, properties, and assistant panel.',
    src: '/images/internship/lectureguru1.png',
    tone: 'dark',
  },
  {
    title: 'Project sources',
    caption: 'Workspace-level source management for documents, URLs, and presentation context.',
    src: '/images/internship/lectureguru2.png',
    tone: 'dark',
  },
  {
    title: 'Files overview',
    caption: 'Generated interactive presentations organized with metadata, counts, ownership, and actions.',
    src: '/images/internship/lectureguru3.png',
    tone: 'dark',
  },
  {
    title: 'Interactive deck',
    caption: 'Browser-native slides with navigation, voice-ready structure, and rich layouts.',
    src: '/images/internship/lectureguru4.png',
    tone: 'dark',
  },
  {
    title: 'Data slide',
    caption: 'Generated charts and visual explanations rendered as presentation-grade output.',
    src: '/images/internship/lectureguru5.png',
    tone: 'light',
  },
  {
    title: 'Assistant start',
    caption: 'Dark-mode assistant entry screen for starting a new LectureGuru presentation flow.',
    src: '/images/internship/lectureguru-assistant-start-dark.png',
    tone: 'dark',
  },
  {
    title: 'Localized editor',
    caption: 'Slovak slide editor with localized navigation, slide thumbnails, and assistant panel.',
    src: '/images/internship/lectureguru-editor-bolivia-dark.png',
    tone: 'dark',
  },
  {
    title: 'Files gallery',
    caption: 'Organization-wide image assets grouped by generated project and source context.',
    src: '/images/internship/lectureguru-files-images.png',
    tone: 'light',
  },
  {
    title: 'Conversations list',
    caption: 'Conversation history showing project-linked AI generation workflows and drafts.',
    src: '/images/internship/lectureguru-conversations.png',
    tone: 'light',
  },
  {
    title: 'Project personalization',
    caption: 'Project settings for language, audience, theme colors, fonts, and presentation focus.',
    src: '/images/internship/lectureguru-project-personalization.png',
    tone: 'light',
  },
  {
    title: 'Sources grid',
    caption: 'Project source materials collected as reusable context for generated learning content.',
    src: '/images/internship/lectureguru-project-sources-grid.png',
    tone: 'light',
  },
  {
    title: 'Presentation list',
    caption: 'Generated presentations managed inside a project workspace with edit, chat, and open actions.',
    src: '/images/internship/lectureguru-project-presentations.png',
    tone: 'light',
  },
  {
    title: 'Generation complete',
    caption: 'Assistant completion state after creating an interactive presentation from uploaded material.',
    src: '/images/internship/lectureguru-generation-ready.png',
    tone: 'light',
  },
  {
    title: 'Image chat flow',
    caption: 'Image-based chat prompt that turns an uploaded product photo into a structured deck.',
    src: '/images/internship/lectureguru-image-chat-flow.png',
    tone: 'light',
  },
  {
    title: 'Sharing dialog',
    caption: 'Presentation sharing controls with visibility, share link, invitations, and export progress.',
    src: '/images/internship/lectureguru-share-dialog.png',
    tone: 'light',
  },
  {
    title: 'Slide editor',
    caption: 'Generated product presentation opened in the editor with slide content and properties.',
    src: '/images/internship/lectureguru-editor-caffeine.png',
    tone: 'light',
  },
  {
    title: 'Line chart deck',
    caption: 'Published interactive slide with multi-series startup market data visualization.',
    src: '/images/internship/lectureguru-deck-ai-startups-line-chart.png',
    tone: 'light',
  },
  {
    title: 'Factor chart deck',
    caption: 'Published interactive slide with grouped bar charts and slide navigation controls.',
    src: '/images/internship/lectureguru-deck-ai-startups-factor-chart.png',
    tone: 'light',
  },
];

const productEvolution = [
  {
    label: 'At the start',
    title: 'A useful generator with flat content.',
    items: [
      'Conversations, source files, and outputs lived mostly as separate objects.',
      'Presentation outputs were centered on static files and preview flows.',
      'Post-generation editing, sharing, analytics, and localization were limited.',
    ],
  },
  {
    label: 'By the end',
    title: 'A workspace for hosted learning products.',
    items: [
      'Projects grouped chats, sources, branding, instructions, and generated decks.',
      'Interactive slides supported quizzes, charts, voiceovers, sharing, analytics, and exports.',
      'Custom AI presentations, editor assistance, and Slovak/English coverage expanded the platform into a broader product surface.',
    ],
  },
];

const shippedSystems = [
  {
    index: '01',
    title: 'Projects & sources',
    body: 'Reusable workspaces for chats, documents, URLs, instructions, branding, and generated outputs.',
  },
  {
    index: '02',
    title: 'Interactive presentations',
    body: 'Browser-native presentations with templates, animations, charts, images, voiceovers, and quiz slides.',
  },
  {
    index: '03',
    title: 'Editor + AI assistant',
    body: 'Direct slide editing and assistant-driven changes grounded in the current deck state.',
  },
  {
    index: '04',
    title: 'Sharing & analytics',
    body: 'Public and private links, invitations, viewer activity, quiz results, and CSV exports.',
  },
  {
    index: '05',
    title: 'Exports',
    body: 'PDF and video generation through background jobs, progress states, and stored export records.',
  },
  {
    index: '06',
    title: 'Localization',
    body: 'Slovak and English dashboard, email, voice, and AI-flow coverage.',
  },
  {
    index: '07',
    title: 'Reliability and access',
    body: 'Validation, signed asset access, credit handling, cache refreshes, route privacy, and export recovery.',
  },
  {
    index: '08',
    title: 'Custom AI presentations',
    body: 'Agent-built bespoke presentations with hybrid editing, publishing validation, and safer rebuilds.',
  },
];

const workstreams = [
  {
    index: '01',
    title: 'Projects and sources',
    body: 'A workspace model for chats, source files, custom instructions, theme settings, and generated presentations.',
  },
  {
    index: '02',
    title: 'Interactive slides',
    body: 'A browser-based presentation format with templates, animation, charts, images, voiceovers, and quiz slides.',
  },
  {
    index: '03',
    title: 'Editor and AI assistant',
    body: 'In-browser editing for text, charts, images, audio, layout, themes, and assistant-driven changes.',
  },
  {
    index: '04',
    title: 'Exports and reliability',
    body: 'PDF and video export pipelines, background jobs, signed storage links, credit handling, validation, and security fixes.',
  },
  {
    index: '05',
    title: 'Localization',
    body: 'Slovak and English dashboard coverage, localized email templates, formal Slovak register, and language-aware AI flows.',
  },
];

const impactLessons = [
  {
    title: 'Why it mattered',
    items: [
      'Teams can share hosted learning links instead of passing around static files.',
      'Authors can revise generated decks in the browser instead of starting over.',
      'Quizzes and analytics turn presentations into measurable training material.',
      'Slovak and English coverage made the product more usable for local customers.',
    ],
  },
  {
    title: 'What production taught me',
    items: [
      'AI features become product systems once billing, validation, storage, privacy, and background jobs are involved.',
      'Export pipelines need recovery paths, progress visibility, and output that matches the live deck.',
      'Published content needs deliberate cache invalidation after saves, visibility changes, image completion, and audio completion.',
      'Access control, credit handling, and browser smoke validation matter as much as the visible editor UI.',
    ],
  },
];

const markImageFailed = (src: string) => {
  const next = new Set(failedImages.value);
  next.add(src);
  failedImages.value = next;
};

const imageFailed = (src: string) => failedImages.value.has(src);

const prefersReducedMotion = () =>
  typeof window !== 'undefined' &&
  window.matchMedia &&
  window.matchMedia('(prefers-reduced-motion: reduce)').matches;

const GalleryShowcase = defineComponent({
  props: {
    mode: {
      type: String,
      required: true,
    },
  },
  setup(props) {
    const trackRef = ref<HTMLElement | null>(null);
    const modeClass = computed(() => `gallery-showcase gallery-${props.mode}`);
    const scrollGallery = (direction: number) => {
      const track = trackRef.value;

      if (!track || typeof window === 'undefined') {
        return;
      }

      const firstCard = track.querySelector<HTMLElement>('.screenshot-card');
      const trackStyles = window.getComputedStyle(track);
      const gap = parseFloat(trackStyles.columnGap || trackStyles.gap) || 0;
      const distance = firstCard
        ? firstCard.getBoundingClientRect().width + gap
        : track.clientWidth;
      const maxScroll = track.scrollWidth - track.clientWidth;

      if (maxScroll <= 0) {
        return;
      }

      const edgeThreshold = 8;
      let target = track.scrollLeft + direction * distance;

      if (direction > 0 && track.scrollLeft >= maxScroll - edgeThreshold) {
        target = 0;
      } else if (direction < 0 && track.scrollLeft <= edgeThreshold) {
        target = maxScroll;
      }

      track.scrollTo({
        left: Math.max(0, Math.min(target, maxScroll)),
        behavior: prefersReducedMotion() ? 'auto' : 'smooth',
      });
    };

    return () =>
      h(
        'section',
        { class: modeClass.value, 'aria-label': 'LectureGuru screenshot gallery' },
        [
          h('div', { class: 'gallery-heading' }, [
            h('h3', 'LectureGuru interface gallery'),
            h('p', 'A showcase of LectureGuru in use: projects, sources, AI generation, slide editing, sharing, and interactive chart-heavy decks.'),
          ]),
          h(
            'div',
            { class: 'gallery-stage' },
            [
              h(
                'button',
                {
                  type: 'button',
                  class: 'gallery-nav gallery-nav-prev',
                  'aria-label': 'Previous product screenshot',
                  onClick: () => scrollGallery(-1),
                },
                '‹'
              ),
              h(
                'div',
                { ref: trackRef, class: 'gallery-track' },
                screenshots.map((shot) =>
                  h(
                    'figure',
                    {
                      class: ['screenshot-card', `tone-${shot.tone}`],
                    },
                    [
                      h('div', { class: 'screenshot-frame' }, [
                        !imageFailed(shot.src)
                          ? h('img', {
                              src: shot.src,
                              alt: `${shot.title} screenshot`,
                              loading: 'lazy',
                              onError: () => markImageFailed(shot.src),
                            })
                          : h('div', { class: 'screenshot-fallback' }, [
                              h('span', shot.title),
                              h('small', shot.src.replace('/images/internship/', '')),
                            ]),
                      ]),
                      h('figcaption', [
                        h('strong', shot.title),
                        h('span', shot.caption),
                      ]),
                    ]
                  )
                )
              ),
              h(
                'button',
                {
                  type: 'button',
                  class: 'gallery-nav gallery-nav-next',
                  'aria-label': 'Next product screenshot',
                  onClick: () => scrollGallery(1),
                },
                '›'
              ),
            ]
          ),
        ]
      );
  },
});
</script>

<style scoped>
.internship-page {
  --ink: #202633;
  --muted: #667085;
  --soft: #f5f7fb;
  --line: #dfe6ef;
  --accent: #2563eb;
  --accent-2: #0f9f6e;
  --warm: #f59e0b;
  background: #fff;
  color: var(--ink);
  font-family: 'Sora', 'Segoe UI', Arial, sans-serif;
  min-height: 100vh;
  padding: 112px 24px 80px;
  text-rendering: optimizeLegibility;
}

:global(html),
:global(body) {
  overflow-x: clip;
}

.internship-variant-shell {
  max-width: 1280px;
  margin: 0 auto;
}

.variant-toolbar {
  display: flex;
  align-items: flex-end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 52px;
}

.eyebrow,
.section-label {
  color: var(--muted);
  font-size: 0.78rem;
  font-weight: 700;
  text-transform: uppercase;
  letter-spacing: 0.12em;
}

.editorial-hero h2,
.systems-hero h2,
.gallery-hero h2 {
  margin: 0;
}

.variant-toolbar h1 {
  font-size: 2.8rem;
  line-height: 0.94;
  margin: 0;
}

.toolbar-kicker {
  color: #333;
  font-family: 'Sora', 'Segoe UI', Arial, sans-serif;
  font-size: 1.1rem;
  font-weight: 400;
  line-height: 1.6;
  letter-spacing: 0;
  text-transform: none;
}

.variant-switcher {
  display: grid;
  grid-template-columns: repeat(3, minmax(112px, 1fr));
  gap: 6px;
  padding: 6px;
  border: 1px solid var(--line);
  border-radius: 8px;
  background: #fff;
  box-shadow: 0 18px 50px rgba(32, 38, 51, 0.08);
}

.variant-switcher button {
  appearance: none;
  border: 0;
  border-radius: 6px;
  background: transparent;
  color: var(--muted);
  cursor: pointer;
  font: inherit;
  font-weight: 700;
  padding: 12px 14px;
  transition: background 180ms ease, color 180ms ease;
}

.variant-switcher button.active {
  background: var(--ink);
  color: #fff;
}

.variant {
  animation: reveal 360ms ease both;
}

.editorial-hero {
  display: grid;
  grid-template-columns: minmax(0, 1.2fr) minmax(260px, 0.62fr);
  gap: 56px;
  align-items: end;
  min-height: 520px;
  padding-bottom: 64px;
  border-bottom: 1px solid var(--line);
}

.hero-copy {
  max-width: 780px;
}

.editorial-hero h2 {
  max-width: 860px;
  font-size: 2.8rem;
  line-height: 0.94;
}

.hero-summary,
.systems-hero p,
.gallery-hero p {
  color: #455166;
  font-size: 1.22rem;
  line-height: 1.7;
  margin: 28px 0 0;
  max-width: 780px;
}

.hero-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 12px;
  margin-top: 36px;
}

.hero-actions a {
  border: 1px solid var(--ink);
  border-radius: 8px;
  color: var(--ink);
  font-weight: 800;
  padding: 13px 18px;
}

.hero-actions a:first-child {
  background: var(--ink);
  color: #fff;
}

.hero-facts {
  display: grid;
  gap: 10px;
}

.hero-facts span {
  border-bottom: 1px solid var(--line);
  color: #394457;
  font-size: 1.05rem;
  font-weight: 700;
  padding: 18px 0;
}

.split-copy {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 52px;
  padding: 72px 0;
}

.split-copy p:not(.section-label),
.gallery-copy-row p:not(.section-label),
.systems-abstract p,
.system-node p,
.matrix-row p,
.workstream-card p,
.timeline-strip p {
  color: #4e5b70;
  font-size: 1.04rem;
  line-height: 1.72;
  margin: 0;
}

.split-copy .section-label,
.gallery-copy-row .section-label {
  margin: 0 0 14px;
}

.gallery-showcase {
  background: transparent;
  margin: 20px calc(50% - 50vw) 70px;
  padding: 72px max(24px, calc(((100vw - 1280px) / 2) + var(--systems-content-offset, 0px))) 86px;
  overflow: hidden;
}

.gallery-showcase :deep(.gallery-heading) {
  display: grid;
  grid-template-columns: minmax(260px, 0.42fr) minmax(320px, 0.58fr);
  align-items: end;
  gap: 24px;
  margin-bottom: 34px;
}

.gallery-showcase :deep(.gallery-heading h3) {
  font-size: 2.8rem;
  line-height: 1.08;
  margin: 0;
  padding-bottom: 0.05em;
}

.gallery-showcase :deep(.gallery-heading p:last-child) {
  color: var(--muted);
  font-size: 1rem;
  line-height: 1.55;
  margin: 0;
}

.gallery-showcase :deep(.gallery-stage) {
  position: relative;
}

.gallery-showcase :deep(.gallery-nav) {
  appearance: none;
  position: absolute;
  top: 43%;
  z-index: 4;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  min-width: 44px;
  min-height: 44px;
  border: 0;
  border-radius: 999px;
  padding: 0;
  background: transparent;
  color: #5f74c2;
  cursor: pointer;
  filter: drop-shadow(0 1px 2px rgba(0, 0, 0, 0.1));
  font: inherit;
  font-size: 3.35rem;
  font-weight: 300;
  line-height: 0.8;
  opacity: 0.72;
  transform: translateY(-50%);
  transition-property: color, opacity, transform;
  transition-duration: 0.2s, 0.2s, 0.16s;
  transition-timing-function: ease, ease, cubic-bezier(0.2, 0, 0, 1);
  -webkit-tap-highlight-color: transparent;
}

.gallery-showcase :deep(.gallery-nav:hover) {
  color: #4D63BB;
  opacity: 1;
}

.gallery-showcase :deep(.gallery-nav:active) {
  transform: translateY(-50%) scale(0.96);
}

.gallery-showcase :deep(.gallery-nav:focus-visible) {
  outline: 3px solid rgba(77, 99, 187, 0.28);
  outline-offset: 3px;
}

.gallery-showcase :deep(.gallery-nav-prev) {
  left: clamp(10px, 2vw, 24px);
}

.gallery-showcase :deep(.gallery-nav-next) {
  right: clamp(10px, 2vw, 24px);
}

.gallery-showcase :deep(.gallery-track) {
  display: flex;
  gap: 22px;
  overflow-x: auto;
  padding: 18px 0 26px;
  scroll-snap-type: x mandatory;
  scrollbar-width: thin;
}

.gallery-showcase :deep(.screenshot-card) {
  flex: 0 0 min(880px, 78vw);
  margin: 0;
  scroll-snap-align: center;
}

.gallery-gallery :deep(.screenshot-card) {
  flex-basis: min(1040px, 86vw);
}

.gallery-showcase :deep(.screenshot-frame) {
  aspect-ratio: 16 / 9;
  background: #111;
  border: 1px solid rgba(17, 24, 39, 0.12);
  border-radius: 8px;
  box-shadow: 0 28px 70px rgba(32, 38, 51, 0.18);
  overflow: hidden;
}

.gallery-showcase :deep(.tone-light .screenshot-frame) {
  background: #f2f4f8;
}

.gallery-showcase :deep(.screenshot-frame img) {
  width: 100%;
  height: 100%;
  object-fit: contain;
}

.gallery-showcase :deep(.screenshot-fallback) {
  display: grid;
  place-content: center;
  gap: 8px;
  height: 100%;
  padding: 32px;
  text-align: center;
  background:
    linear-gradient(90deg, rgba(255,255,255,0.06) 1px, transparent 1px),
    linear-gradient(180deg, rgba(255,255,255,0.06) 1px, transparent 1px),
    #141820;
  background-size: 48px 48px;
  color: #fff;
}

.gallery-showcase :deep(.tone-light .screenshot-fallback) {
  background:
    linear-gradient(90deg, rgba(32,38,51,0.06) 1px, transparent 1px),
    linear-gradient(180deg, rgba(32,38,51,0.06) 1px, transparent 1px),
    #f2f4f8;
  color: var(--ink);
}

.gallery-showcase :deep(.screenshot-fallback span) {
  font-size: 2rem;
  font-weight: 800;
}

.gallery-showcase :deep(.screenshot-fallback small) {
  color: #98a2b3;
  font-size: 0.9rem;
}

.gallery-showcase :deep(.screenshot-card figcaption) {
  display: flex;
  justify-content: space-between;
  gap: 28px;
  padding-top: 18px;
}

.gallery-showcase :deep(.screenshot-card figcaption strong) {
  color: var(--ink);
  font-size: 1.1rem;
  white-space: nowrap;
}

.gallery-showcase :deep(.screenshot-card figcaption span) {
  color: var(--muted);
  line-height: 1.45;
  max-width: 520px;
}

.gallery-editorial {
  background: var(--soft);
}


.gallery-gallery {
  background: #f7f9fc;
}

.workstream-grid {
  display: grid;
  grid-template-columns: repeat(5, minmax(0, 1fr));
  gap: 14px;
}

.workstream-card {
  border: 1px solid var(--line);
  border-radius: 8px;
  padding: 22px;
  min-height: 255px;
}

.workstream-card span {
  color: var(--accent);
  font-weight: 900;
}

.workstream-card h3 {
  font-size: 1.18rem;
  margin: 28px 0 14px;
}

.variant-systems {
  --systems-content-offset: 139px;
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 58px;
  min-width: 0;
}

.systems-main {
  min-width: 0;
}

.scroll-scene {
  scroll-margin-top: 120px;
}

.scene-hero,
.scene-abstract,
.scene-gallery,
.scene-matrix {
  transform-style: preserve-3d;
}

.scene-abstract,
.scene-gallery,
.scene-matrix {
  position: relative;
}

.scene-abstract,
.scene-gallery {
  perspective: 1100px;
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

.internship-download-actions {
  display: flex;
  flex-wrap: wrap;
  gap: 10px;
  margin-top: 10px;
}

.internship-mobile-downloads {
  display: none;
}

.internship-button {
  appearance: none;
  box-sizing: border-box;
  display: inline-flex;
  align-items: center;
  justify-content: center;
  min-height: 40px;
  border-radius: 999px;
  padding: 0.7rem 1.25rem;
  font: inherit;
  font-size: 0.95rem;
  font-weight: 500;
  line-height: 1;
  text-decoration: none;
  white-space: nowrap;
  cursor: pointer;
  transition: transform 0.15s ease, background-color 0.15s ease, color 0.15s ease, border-color 0.15s ease;
}

.internship-button:hover {
  transform: translateY(-2px);
}

.internship-button-primary {
  border: 1px solid #111;
  background: #111;
  color: #fff;
}

.internship-button-primary:hover {
  background: #000;
  color: #fff;
}

.systems-index .internship-button-primary {
  max-width: 220px;
  color: #fff;
  line-height: 1.2;
  text-align: center;
  white-space: normal;
}

.internship-button-secondary {
  border: 1px solid rgba(0, 0, 0, 0.25);
  background: transparent;
  color: #111;
}

.internship-button-secondary:hover {
  border-color: rgba(0, 0, 0, 0.5);
  color: #111;
}

.internship-download-icon {
  flex: 0 0 auto;
  width: 17px;
  height: 17px;
  margin-left: 0.35rem;
  fill: none;
  stroke: currentColor;
  stroke-linecap: round;
  stroke-linejoin: round;
  stroke-width: 2;
}

.systems-hero {
  padding: 28px 0 70px;
}

.systems-hero h2,
.gallery-hero h2 {
  max-width: 1000px;
  font-size: 2.8rem;
  line-height: 0.98;
}

.systems-abstract {
  display: grid;
  grid-template-columns: 220px minmax(0, 1fr);
  gap: 40px;
  align-items: start;
  overflow: hidden;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 44px 0;
}

.systems-abstract::before {
  content: '';
  position: absolute;
  top: -1px;
  left: 0;
  width: 100%;
  height: 2px;
  background: linear-gradient(90deg, var(--accent), var(--accent-2), var(--warm));
  transform: scaleX(var(--abstract-scan, 0));
  transform-origin: left center;
}

.abstract-number {
  color: rgb(77, 99, 187);
  font-weight: 900;
  line-height: 0.9;
  transform-origin: left center;
}

.abstract-number strong {
  display: block;
  font-size: 5rem;
  font-variant-numeric: tabular-nums;
  line-height: 0.86;
}

.abstract-number span {
  display: block;
  color: var(--muted);
  font-size: 0.86rem;
  font-weight: 800;
  letter-spacing: 0.14em;
  line-height: 1.1;
  margin-top: 10px;
  text-transform: uppercase;
}

.section-heading {
  display: grid;
  grid-template-columns: minmax(140px, 0.38fr) minmax(0, 1fr);
  gap: 28px;
  align-items: end;
  margin-bottom: 28px;
}

.section-heading h3 {
  color: var(--ink);
  font-size: 2.45rem;
  line-height: 1.04;
  margin: 0;
  max-width: 860px;
}

.section-heading .section-label {
  margin: 0;
}

.product-evolution {
  border-bottom: 1px solid var(--line);
  padding: 64px 0 66px;
}

.evolution-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.evolution-column {
  display: grid;
  align-content: start;
  gap: 18px;
  min-height: 340px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 30px;
}

.evolution-column span,
.system-node span {
  color: var(--accent);
  font-size: 0.85rem;
  font-weight: 900;
  letter-spacing: 0.12em;
  text-transform: uppercase;
}

.evolution-column h4,
.system-node h4,
.impact-column h4 {
  color: var(--ink);
  font-size: 1.3rem;
  line-height: 1.22;
  margin: 0;
  text-wrap: balance;
}

.evolution-column ul,
.impact-column ul {
  display: grid;
  gap: 13px;
  list-style: none;
  margin: 0;
  padding: 0;
}

.evolution-column li,
.impact-column li {
  position: relative;
  color: #4e5b70;
  font-size: 1rem;
  line-height: 1.62;
  padding-left: 22px;
  text-wrap: pretty;
}

.evolution-column li::before,
.impact-column li::before {
  content: '';
  position: absolute;
  top: 0.78em;
  left: 0;
  width: 7px;
  height: 7px;
  border-radius: 999px;
  background: linear-gradient(135deg, var(--accent), var(--accent-2));
}

.live-presentation {
  margin: 34px calc(50% - 50vw) 74px;
  padding: 58px max(48px, calc(((100vw - 1280px) / 2) + var(--systems-content-offset, 0px)));
  background: transparent;
  border-top: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
}

.live-presentation-heading {
  display: flex;
  align-items: end;
  justify-content: space-between;
  gap: 24px;
  margin-bottom: 24px;
}

.live-presentation-heading h3 {
  color: var(--ink);
  font-size: 2.8rem;
  line-height: 1;
  margin: 8px 0 0;
  max-width: 860px;
}

.live-presentation-heading .internship-button {
  flex: 0 0 auto;
}

.presentation-frame {
  position: relative;
  aspect-ratio: 16 / 9;
  width: min(1320px, calc(100vw - 96px));
  max-width: 100%;
  margin: 0 auto;
  min-height: 0;
  overflow: hidden;
  border: 1px solid rgba(32, 38, 51, 0.16);
  border-radius: 8px;
  background: #0b0c0f;
  box-shadow: 0 28px 80px rgba(32, 38, 51, 0.16);
  transform-style: preserve-3d;
}

.presentation-frame iframe {
  display: block;
  width: 161.29%;
  height: 161.29%;
  border: 0;
  transform: scale(0.62);
  transform-origin: top left;
}

.presentation-nav {
  appearance: none;
  position: absolute;
  top: 50%;
  z-index: 2;
  display: grid;
  place-items: center;
  width: 44px;
  height: 44px;
  border: 1px solid rgba(255, 255, 255, 0.22);
  border-radius: 999px;
  background: rgba(10, 12, 16, 0.38);
  color: #fff;
  cursor: pointer;
  font: inherit;
  font-size: 2.1rem;
  font-weight: 300;
  line-height: 1;
  transform: translateY(-50%);
  backdrop-filter: blur(12px);
  box-shadow: 0 16px 34px rgba(0, 0, 0, 0.18);
  transition: background 160ms ease, transform 160ms ease, border-color 160ms ease;
}

.presentation-nav:hover {
  background: rgba(10, 12, 16, 0.58);
  border-color: rgba(255, 255, 255, 0.34);
  transform: translateY(-50%) scale(1.04);
}

.presentation-nav:focus-visible {
  outline: 3px solid rgba(37, 99, 235, 0.42);
  outline-offset: 3px;
}

.presentation-nav-prev {
  left: 16px;
}

.presentation-nav-next {
  right: 16px;
}

.systems-map {
  padding: 0 0 78px;
}

.systems-map-grid {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.system-node {
  display: grid;
  align-content: start;
  gap: 15px;
  min-height: 250px;
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 24px;
}

.systems-matrix {
  border-top: 1px solid var(--line);
  overflow: hidden;
}

.systems-matrix::before {
  content: '';
  position: absolute;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  background: linear-gradient(90deg, transparent, rgba(37, 99, 235, 0.08), transparent);
  transform: translateX(var(--matrix-scan, -110%));
}

.matrix-row {
  position: relative;
  z-index: 1;
  display: grid;
  grid-template-columns: 80px 260px minmax(0, 1fr);
  gap: 24px;
  border-bottom: 1px solid var(--line);
  padding: 28px 0;
  transform-origin: center;
}

.matrix-row span {
  color: var(--accent);
  font-weight: 900;
}

.matrix-row strong {
  font-size: 1.08rem;
}

.impact-lessons {
  padding: 78px 0 12px;
}

.impact-grid {
  display: grid;
  grid-template-columns: repeat(2, minmax(0, 1fr));
  gap: 0;
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.impact-column {
  border-right: 1px solid var(--line);
  border-bottom: 1px solid var(--line);
  padding: 30px;
}

.impact-column h4 {
  margin-bottom: 22px;
}

.gallery-hero {
  display: grid;
  gap: 20px;
  padding: 46px 0 58px;
}

.gallery-copy-row {
  display: grid;
  grid-template-columns: 0.48fr 1fr 1fr;
  gap: 34px;
  padding: 10px 0 68px;
}

.gallery-copy-row h3 {
  font-size: 2.8rem;
  margin: 0;
}

.variant-toolbar h1,
.editorial-hero h2,
.systems-hero h2,
.gallery-hero h2,
.section-heading h3,
.live-presentation-heading h3,
.gallery-showcase :deep(.gallery-heading h3),
.evolution-column h4,
.system-node h4,
.impact-column h4,
.workstream-card h3,
.gallery-copy-row h3 {
  color: #2d3748;
  font-family: 'Sora', 'Segoe UI', Arial, sans-serif;
  font-weight: 700;
  letter-spacing: -0.02em;
  text-wrap: balance;
}

.timeline-strip {
  display: grid;
  grid-template-columns: repeat(4, minmax(0, 1fr));
  border-top: 1px solid var(--line);
  border-left: 1px solid var(--line);
}

.timeline-strip div {
  border-right: 1px solid var(--line);
  padding: 24px;
}

.timeline-strip span {
  color: var(--warm);
  display: block;
  font-weight: 900;
  margin-bottom: 26px;
}

.timeline-strip strong {
  display: block;
  font-size: 1.2rem;
  margin-bottom: 12px;
}

@keyframes reveal {
  from {
    opacity: 0;
    transform: translateY(12px);
  }
  to {
    opacity: 1;
    transform: translateY(0);
  }
}

@media (max-width: 1100px) {
  .variant-toolbar,
  .editorial-hero,
  .split-copy,
  .variant-systems,
  .systems-abstract,
  .section-heading,
  .live-presentation-heading,
  .gallery-copy-row {
    grid-template-columns: 1fr;
  }

  .variant-toolbar {
    display: none;
    margin-bottom: 0;
  }

  .internship-mobile-downloads {
    display: flex;
    flex-wrap: wrap;
    align-items: center;
    gap: 10px;
    margin: 0 0 12px;
  }

  .systems-index {
    display: none;
  }

  .variant-systems {
    --systems-content-offset: 0px;
  }

  .workstream-grid,
  .systems-map-grid,
  .timeline-strip {
    grid-template-columns: repeat(2, minmax(0, 1fr));
  }

  .evolution-grid,
  .impact-grid {
    grid-template-columns: 1fr;
  }

  .gallery-showcase :deep(.gallery-heading) {
    grid-template-columns: 1fr;
  }
}

@media (max-width: 720px) {
  .internship-page {
    padding: 66px 16px 56px;
  }

  .internship-variant-shell {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .internship-mobile-downloads {
    margin-bottom: 28px;
  }

  .variant-toolbar h1,
  .editorial-hero h2,
  .systems-hero h2,
  .gallery-hero h2,
  .section-heading h3,
  .live-presentation-heading h3,
  .gallery-showcase :deep(.gallery-heading h3),
  .gallery-copy-row h3 {
    font-size: 2rem;
  }

  .variant-switcher {
    grid-template-columns: 1fr;
    width: 100%;
  }

  .editorial-hero {
    min-height: auto;
  }

  .hero-summary,
  .systems-hero p,
  .gallery-hero p {
    font-size: 1.04rem;
  }

  .systems-hero {
    padding: 0 0 20px;
  }

  .systems-abstract {
    gap: 18px;
    padding: 28px 0;
  }

  .abstract-number {
    align-self: start;
  }

  .abstract-number strong {
    font-size: 3.7rem;
  }

  #systems-evolution.product-evolution {
    margin: 0 !important;
    margin-top: 20px !important;
    padding: 0 !important;
  }

  .section-heading {
    gap: 10px;
    margin-bottom: 20px;
    justify-items: start;
    text-align: left;
  }

  .section-heading h3,
  .section-heading .section-label,
  .live-presentation-heading h3,
  .live-presentation-heading .section-label,
  .gallery-showcase :deep(.gallery-heading h3),
  .gallery-showcase :deep(.gallery-heading p) {
    text-align: left;
  }

  .evolution-column,
  .system-node,
  .impact-column {
    padding: 22px 18px;
  }

  .evolution-column {
    min-height: auto;
  }

  .gallery-showcase {
    background: transparent;
    width: 100vw;
    max-width: none;
    box-sizing: border-box;
    margin-top: 0 !important;
    margin-bottom: 22px;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
    padding-left: 0;
    padding-right: 0;
    padding-top: 0 !important;
    padding-bottom: 24px;
  }

  #systems-gallery {
    margin-top: 0 !important;
    padding-top: 0 !important;
  }

  .gallery-showcase :deep(.gallery-heading) {
    margin-top: 0;
    margin-bottom: 8px;
    padding-left: 16px;
    padding-right: 16px;
    padding-top: 0;
  }

  .gallery-showcase :deep(.gallery-nav) {
    top: 34%;
    width: 42px;
    height: 42px;
    min-width: 42px;
    min-height: 42px;
    font-size: 3rem;
    opacity: 0.84;
  }

  .gallery-showcase :deep(.gallery-nav-prev) {
    left: 8px;
  }

  .gallery-showcase :deep(.gallery-nav-next) {
    right: 8px;
  }

  .live-presentation {
    margin-top: 0;
    margin-bottom: 42px;
    margin-left: -16px;
    margin-right: -16px;
    padding-top: 32px;
    padding-bottom: 36px;
    padding-left: 16px;
    padding-right: 16px;
    border-top: 0;
  }

  .live-presentation-heading {
    display: grid;
    grid-template-columns: minmax(0, 1fr) auto;
    column-gap: 8px;
    row-gap: 10px;
    align-items: start;
    margin-bottom: 18px;
  }

  .live-presentation-heading > div {
    display: contents;
  }

  .live-presentation-heading .section-label {
    grid-column: 1;
    grid-row: 1;
    align-self: center;
    min-width: 0;
  }

  .live-presentation-heading h3 {
    grid-column: 1 / -1;
    grid-row: 2;
    margin-top: 0;
  }

  .live-presentation-heading .internship-presentation-link {
    grid-column: 2;
    grid-row: 1;
    justify-self: end;
    align-self: start;
    padding-inline: 0.75rem;
    border-color: rgba(0, 0, 0, 0.25);
    background: transparent;
    color: #111;
    font-size: 0.88rem;
  }

  .live-presentation-heading .internship-presentation-link:hover {
    border-color: rgba(0, 0, 0, 0.5);
    background: transparent;
    color: #111;
  }

  .presentation-frame {
    width: 100vw;
    max-width: none;
    margin-left: -16px;
    margin-right: -16px;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }

  .presentation-frame iframe {
    width: var(--presentation-mobile-width, 1200px);
    height: var(--presentation-mobile-height, 675px);
    transform: scale(var(--presentation-mobile-scale, 0.333333));
  }

  .presentation-nav {
    width: 38px;
    height: 38px;
    font-size: 1.8rem;
  }

  .presentation-nav-prev {
    left: 10px;
  }

  .presentation-nav-next {
    right: 10px;
  }

  .gallery-showcase :deep(.screenshot-card) {
    flex: 0 0 100%;
    max-width: 100%;
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  .gallery-showcase :deep(.screenshot-frame) {
    width: 100%;
    border-left: 0;
    border-right: 0;
    border-radius: 0;
  }

  .gallery-showcase :deep(.screenshot-frame img) {
    width: 100%;
    max-width: none;
    object-fit: contain;
    transform: none;
  }

  .gallery-showcase :deep(.gallery-heading),
  .gallery-showcase :deep(.gallery-track) {
    opacity: 1 !important;
    transform: none !important;
    filter: none !important;
  }

  .gallery-showcase :deep(.gallery-track) {
    gap: 16px;
    padding-top: 0;
    width: 100%;
  }

  .gallery-showcase :deep(.screenshot-card figcaption) {
    display: grid;
    padding-left: 16px;
    padding-right: 16px;
  }

  .workstream-grid,
  .systems-map-grid,
  .timeline-strip,
  .impact-grid,
  .matrix-row {
    grid-template-columns: 1fr;
  }

  #systems-stack.systems-matrix {
    box-sizing: border-box;
    width: 100vw;
    max-width: none;
    margin-left: calc(50% - 50vw);
    margin-right: calc(50% - 50vw);
  }

  #systems-stack .matrix-row {
    padding-left: 16px;
    padding-right: 16px;
  }

  .systems-map {
    margin-top: 0 !important;
    padding-top: 0 !important;
    padding-bottom: 46px;
  }

  .system-node {
    min-height: auto;
  }

  .impact-lessons {
    padding-top: 48px;
  }
}

@media (prefers-reduced-motion: reduce) {
  .variant {
    animation: none;
  }

  .systems-index a,
  .systems-index a::before,
  .presentation-nav {
    transition-duration: 1ms;
  }
}
</style>
