<template>
  <div class="card">
    <div class="card-image-container">
      <NuxtImg
        v-if="images && images.length > 0"
        :src="images[0]"
        :alt="`${title} project image`"
        class="card-image"
        loading="lazy"
      />
      <div v-else class="card-image-placeholder">
            <svg xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24" stroke-width="1.5" stroke="currentColor" class="placeholder-icon">
               <path stroke-linecap="round" stroke-linejoin="round" d="m2.25 15.75 5.159-5.159a2.25 2.25 0 0 1 3.182 0l5.159 5.159m-1.5-1.5 1.409-1.409a2.25 2.25 0 0 1 3.182 0l2.909 2.909m-18 3.75h16.5a1.5 1.5 0 0 0 1.5-1.5V6a1.5 1.5 0 0 0-1.5-1.5H3.75A1.5 1.5 0 0 0 2.25 6v12a1.5 1.5 0 0 0 1.5 1.5Zm10.5-11.25a2.25 2.25 0 1 1 4.5 0 2.25 2.25 0 0 1-4.5 0Z" />
            </svg>
            <span>No Image Available</span>
       </div>
    </div>
    <div class="card-content">
      <div class="card-header">
        <h3 class="card-title">{{ title }}</h3>
        <div v-if="tags && tags.length" class="card-tags">
          <span
            v-for="tag in tags"
            :key="tag"
            class="card-tag"
            :style="getTagStyle(tag)"
          >
            {{ tag }}
          </span>
        </div>
      </div>
      <p class="card-description">{{ shortDescription }}</p>
      <button
        @click="$emit('view-details', { title, tags, description, images, link })"
        class="card-button-text"
        :disabled="isSelected"
        :class="{ 'disabled': isSelected }"
        aria-label="View more details about the project"
      >
        View More →
      </button>
    </div>
  </div>
</template>

<script setup lang="ts">
interface Project {
  title: string;
  tags?: string[];
  description: string;
  link?: string;
  images?: string[];
  shortDescription: string;
  isSelected?: boolean;
}

defineProps<{
  title: string;
  tags?: string[];
  description: string;
  shortDescription: string;
  link?: string;
  images?: string[];
  isSelected?: boolean;
}>();

defineEmits(['view-details']);

// --- Tag Color Mapping ---
// Complete list of tags provided by the user with suggested colors
const tagColors: { [key: string]: { bg: string; text: string } } = {
  "PHP": { bg: '#777BB4', text: '#ffffff' },
  "Laravel": { bg: '#FF2D20', text: '#ffffff' },
  "Postgres": { bg: '#2F6792', text: '#ffffff' },
  "MySQL": { bg: '#4479A1', text: '#ffffff' },
  "Tailwind CSS": { bg: '#38B2AC', text: '#ffffff' },
  "Alpine.js": { bg: '#8BC0EB', text: '#394F62' },
  "Lifewire": { bg: '#F39200', text: '#ffffff' },
  "Figma": { bg: '#F24E1E', text: '#ffffff' },
  "Amazon S3": { bg: '#569A31', text: '#ffffff' }, // AWS green approx
  "C#": { bg: '#239120', text: '#ffffff'},
  ".NET": { bg: '#512BD4', text: '#ffffff'},
  "Docker": { bg: '#2496ED', text: '#ffffff'},
  "SQL Server": { bg: '#CC2927', text: '#ffffff'}, // SQL Server red approx
  "Entity framework": { bg: '#7C7C7C', text: '#ffffff'}, // Grey for EF
  "React.js": { bg: '#61DAFB', text: '#000000' },
  "TypeScript": { bg: '#3178C6', text: '#ffffff'},
  "Vue.js": { bg: '#4FC08D', text: '#ffffff'},
  "Python": { bg: '#3776AB', text: '#ffffff'},
  "Selenium": { bg: '#43B02A', text: '#ffffff'}, // Selenium green
  "Batch": { bg: '#666666', text: '#ffffff'}, // Neutral grey
  "Nuxt.js": { bg: '#00DC82', text: '#ffffff'},
  "MongoDB": { bg: '#47A248', text: '#ffffff'},
  "Pinia": { bg: '#FEA43B', text: '#000000' }, // Black text for Pinia orange
  "Chart.js": { bg: '#FF6384', text: '#ffffff'},
  "Java": { bg: '#E59A33', text: '#ffffff'}, // Oracle/Java brand color
  "Flask": { bg: '#000000', text: '#ffffff'}, // Icon color
  "InfluxDB": { bg: '#22ADF6', text: '#ffffff'},
  "Grafana": { bg: '#F46800', text: '#ffffff'},
  "Tomcat": { bg: '#F87C00', text: '#ffffff'},
  "Shell": { bg: '#666666', text: '#ffffff'}, // Neutral grey
  "ADO.NET": { bg: '#8BC0EB', text: '#000000'}, // Lighter blue, black text
  "ASP.NET MVC": { bg: '#512BD4', text: '#ffffff'}, // Same as .NET
  "SQL": { bg: '#CC2927', text: '#ffffff'}, // Assuming typo for SQL, using SQL Server red
  "HTML": { bg: '#E34F26', text: '#ffffff'},
  "CSS": { bg: '#1572B6', text: '#ffffff'},
  "JavaScript": { bg: '#F7DF1E', text: '#000000'}, // Should ideally be 'JavaScript'
  "Swing": { bg: '#E59A33', text: '#ffffff'}, // Same as Java
};

// Function to get style object for a tag
const getTagStyle = (tag: string) => {
    // Handle potential case differences or typos like "Javascript" vs "JavaScript" or "SLQ" vs "SQL"
    const normalizedTag = tag === 'Javascript' ? 'JavaScript' : tag === 'SLQ' ? 'SQL' : tag; // Basic normalization
    const colors = tagColors[normalizedTag] || tagColors[tag]; // Try normalized, then original

    if (colors) {
        return {
            '--tag-bg-color': colors.bg,
            '--tag-text-color': colors.text,
        };
    } else {
        // Fallback for unmapped tags - use original grey/blue and potentially warn
        console.warn(`No color mapping found for tag: ${tag}`);
        return {
            '--tag-bg-color': '#e0e7ff', // Default grey/blue background
            '--tag-text-color': '#4338ca', // Default text color
        };
    }
};

</script>

<style scoped>
/* --- Base (Mobile-First) Styles --- */
.card {
  background-color: #fff;
  border-radius: 8px;
  box-shadow: 0 4px 12px rgba(0, 0, 0, 0.08);
  margin: 1rem;
  width: calc(100% - 2rem);
  max-width: 340px;
  overflow: hidden;
  display: flex;
  flex-direction: column;
  transition: transform 0.3s ease, box-shadow 0.3s ease;
}

.card:hover {
  transform: translateY(-5px);
  box-shadow: 0 6px 16px rgba(0, 0, 0, 0.12);
}

.card-image-container {
  width: 100%;
  height: auto;
  /* Removed background-color, border, border-radius, box-shadow, margin */
  background: none; /* Ensure no background */
  border: none;
  border-radius: 0;
  box-shadow: none;
  margin: 0; /* Remove margin */
  flex-shrink: 0;
  display: flex;
  justify-content: center; /* Center image horizontally if it doesn't fill width */
  align-items: center; /* Center image vertically if it doesn't fill container height */
  min-height: 100px;
  overflow: hidden; /* Keep if image needs to be contained within area */
}

.card-image {
  display: block;
  width: 100%; /* Image takes full width of container */
  height: auto; /* Maintain aspect ratio */
  object-fit: contain; /* Ensure the whole image is visible */

  /* Add iOS-like outline/visual separator to the image itself */
  border-radius: 6px; /* Subtle rounded corners on the image */
  /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); Subtle shadow for depth */
  /* Optional: Add a very thin border if shadow isn't enough */
  /* border: 1px solid rgba(0, 0, 0, 0.05); */

  /* Ensure image is centered if container allows */
   margin: 0 auto; /* Center the image if its width is less than container (e.g. due to object-fit) */
}

.card-image-placeholder {
    width: 100%;
    height: 100%;
    display: flex;
    flex-direction: column;
    justify-content: center;
    align-items: center;
    color: #aaa;
    font-size: 0.9rem;
    text-align: center;
    padding: 1rem;
    background-color: #f0f0f0; /* Keep placeholder background */
    border-radius: 6px; /* Match image border radius */
}

.placeholder-icon {
    width: 3em;
    height: 3em;
    margin-bottom: 0.5rem;
    color: #ccc;
}

.card-content {
  padding: 1rem 1.2rem;
  display: flex;
  flex-direction: column;
  flex-grow: 1;
  position: relative;
}

.card-header {
  display: flex;
  flex-direction: column;
  align-items: flex-start;
  /* Less space below header block (title + tags) */
  margin-bottom: 0.4rem; /* Adjusted space */
  gap: 0;
}

.card-title {
  font-size: 1.1rem;
  font-weight: 700;
  color: #333;
  margin: 0;
  /* More space between title and tags */
  margin-bottom: 1rem; /* Increased space */
  line-height: 1.3;
  flex-grow: 0;
  min-width: auto;
}

.card-tags {
  display: flex;
  flex-wrap: wrap;
  gap: 0.4rem;
  margin-top: 0;
  /* This block is now followed by the description */
  margin-bottom: 0.4rem; /* Less space between tags and description */
}

.card-tag {
  background-color: var(--tag-bg-color, #e0e7ff); /* Fallback */
  color: var(--tag-text-color, #4338ca); /* Fallback */
  padding: 0.2rem 0.5rem;
  border-radius: 4px;
  font-size: 0.75rem;
  font-weight: 550; /* Reduced font weight */
  white-space: nowrap;
  flex-shrink: 0;
  transition: background-color 0.2s ease, color 0.2s ease;
}

.card-description {
  font-size: 0.9rem;
  color: #555;
  line-height: 1.5;
  margin-bottom: 0.8rem; /* Space above button area */
  flex-grow: 1;
}

/* --- View More Button (Styled as Text) --- */
.card-button-text {
  background: none; /* Remove background */
  border: none; /* Remove border */
  padding: 0; /* Remove padding */
  color: #4D63BB; /* New color */
  font-size: 0.9rem;
  font-weight: 500; /* Match tags or set explicitly */
  cursor: pointer;
  text-decoration: none; /* Remove underline */
  text-align: right; /* Align text to the right */
  transition: color 0.2s ease;

  /* Positioning to Bottom Right */
  align-self: flex-end; /* Align to the right within flex column */
  margin-top: auto; /* Push to the bottom */
  /* Adjust margin-right if padding of container isn't enough */
   margin-right: 0; /* Ensure no extra margin */
}

.card-button-text:hover {
  color: #3a4c9b; /* Darker shade on hover */
  text-decoration: underline; /* Add underline on hover for text link feel */
}

.card-button-text:disabled,
.card-button-text.disabled {
  color: #cccccc !important; /* Grey out text */
  cursor: not-allowed;
  opacity: 0.7;
  text-decoration: none; /* Remove underline when disabled */
}


/* --- Desktop Styles (Horizontal Layout) --- */
@media (min-width: 768px) {
  .card {
    flex-direction: row;
    max-width: 700px;
    width: 100%;
    align-items: center; /* Vertically center image container and content */
    gap: 1.5rem; /* Add gap between image container and content */
  }

  .card-image-container {
    width: 250px;
    height: auto;
    min-height: 150px;
    /* Margins replaced by parent gap */
    margin: 0;
    /* Keep border/radius/shadow from mobile */
  }

  .card-image {
    /* Keep image styling from mobile */
    width: 100%;
    height: auto;
    object-fit: contain;
    border-radius: 6px;
    /* box-shadow: 0 2px 8px rgba(0, 0, 0, 0.1); */
    margin: 0 auto;
  }

   .card-image-placeholder {
     min-height: 150px;
     border-radius: 6px; /* Match image radius */
   }


  .card-content {
    padding: 1.2rem 1.5rem;
    flex-grow: 1;
    width: auto;
  }

  .card-header {
     margin-bottom: 0.6rem; /* Adjusted space below header block on desktop */
  }

  .card-title {
     font-size: 1.2rem;
     margin-bottom: 0.8rem; /* Adjust margin below title on desktop */
  }

  .card-tags {
      margin-bottom: 0.5rem; /* Adjust space below tags on desktop */
  }

  .card-description {
    font-size: 1rem;
  }

  /* Desktop Button Positioning (already handled by flexbox align-self) */
   .card-button-text {
       margin-right: 0; /* Ensure no extra margin */
   }
}

/* --- Disabled Button Styles --- */
/* Keep existing disabled styles for the new class */
.card-button-text:disabled,
.card-button-text.disabled {
  color: #cccccc !important;
  cursor: not-allowed;
  opacity: 0.7;
   text-decoration: none;
}
</style>