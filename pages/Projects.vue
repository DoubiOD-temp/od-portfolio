<script setup>
const projects = [
  {
    title: "BRAGI",
    tag: "AI",
    description: "A cutting-edge AI-powered video generator that simplifies content creation with minimal input.",
    image: "/images/img.png", // Assuming a new image for BRAGI
    link: "#" // Replace with actual link
  },
  {
    title: "Subtruck AI",
    tag: "App Development",
    description: "An AI-driven app to manage subscriptions efficiently, helping users save money by tracking and optimizing their spending.",
    image: "/images/img.png", // Assuming a new image for Subtruck
    link: "#" // Replace with actual link
  },
  {
    title: "Redefine Progress/Skill 2 Sem2",
    tag: "Web Development",
    description: "A skill integration platform for students, offering easier training session journeys and progress tracking.",
    image: "/images/img.png", // Assuming a new image for Redefine Progress
    link: "#" // Replace with actual link
  },
  {
    title: "Help Students Enroll Easier",
    tag: "UI/UX Design",
    description: "A Figma-designed UI/UX prototype to simplify the student enrollment process with an intuitive and user-friendly interface.",
    image: "/images/img.png", // Assuming a new image for Help Students Enroll Easier
    link: "#" // Replace with actual link
  }
]
</script>

<template>
  <div class="projects-list">
    <Card
      v-for="(project, i) in projects"
      :key="i"
      v-bind="project"
    />
  </div>
</template>