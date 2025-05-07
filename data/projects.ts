export interface Project {
  title: string;
  tags?: string[]; // Still in interface but not displayed
  shortDescription: string; // Still in interface but not displayed
  description: string;
  collaborators?: number | string;
  highlights?: string[];
  image?: string;
  images?: string[];
  githubLink?: string;
  year?: number | string;
}

export const projects: Project[] = [
  {
    title: "Weather & Vessel Operation Prediction",
    tags: ["TypeScript", "Nuxt.js", "Vue.js", "Chart.js", "Pinia", "MongoDB", "Postgres", "Python", "Tailwind CSS"],
    shortDescription: "Provides insights and decision support for offshore operations using historical data visualization",
    description: "Collaboration with DECK1 on a project to provide insights and decision support to stakeholders such as charterers, procurement managers, operators, brokers and more. The main emphasis was on the significance of accurate visualisation of evaluated asset (helicopters, various types of vessels) performance based on historical data and its crucial role in optimising operational efficiency.",
    collaborators: 5,
    highlights: [
      "This MVP was expanded and is now actively used as a SaaS product.",
      "Weather data retrieval for any global location.", 
      "Support in complex decision-making with customizable charts",
      "Minimization of potential health hazards",
      "Opportunity to decrease operational expenses",
      "Accuracy and speed of calculations"
    ],
    year: 2023,
    githubLink: "https://github.com/deck1-org/DECK1",
    images: ["/images/projects/deck1.png"]
  },
  {
    title: "Skill Integration: Training Session Management",
    tags: ["PHP", "Laravel", "MySQL", "Tailwind CSS", "Alpine.js", "Lifewire"],
    shortDescription: "Web platform streamlining training session assignments for students and teachers",
    description: "Skill Integration is a web-based platform designed to streamline the management of training session assignments for both students and teachers. The platform allows students to form teams, select clients, prepare and upload lesson materials, and organize all work in a centralized, structured interface. For teachers, Skill Integration offers real-time progress tracking, live notifications, and a dedicated dashboard for monitoring and grading team submissions, making assignment management more efficient.",
    collaborators: 6,
    highlights: [
      "A modern, intuitive interface with a clean and professional design.",
      "Real-time progress tracking and live notifications",
      "Dark mode and language selection"
    ],
    year: 2025,
    githubLink: undefined,
    images: ["/images/projects/training1.png", "/images/projects/training4.png", "/images/projects/training5.png", "/images/projects/training6.png", "/images/projects/training2.png", "/images/projects/training3.png"]
  },
  {
    title: "SelfLens: Wellbeing tracker",
    shortDescription: "Monitoring various personal metrics and assessing their influence on overall wellbeing",
    description: "The platform features a user-friendly interface that facilitates the visualization of personal data through interactive graphs and charts, allowing users to derive significant insights and make educated choices regarding their daily habits. SelfLens functions as a resource for comprehending daily behaviors and fostering the pursuit of a healthier, more balanced lifestyle. It tackles the challenge faced by individuals who lack awareness of how their routines impact their overall wellbeing by offering a thorough tracking and analytical framework.",
    tags: ["PHP", "Laravel", "Alpine.js", "Tailwind CSS", "Lifewire"],
    collaborators: "Solo project",
    highlights: [
      "Monitoring and evaluating critical metrics such as sleep patterns, screen time, physical activity, and emotional wellbeing",
      "An interactive interface for establishing objectives and categorizing activities",
      "Customizable graphs and charts for filtering information by time frame and category",
      "A personal dashboard that provides a summary of daily objectives and insights"
    ],
    images: ["/images/projects/selflens1.png", "/images/projects/selflens2.png", "/images/projects/selflens3.png", "/images/projects/selflens4.png"],
    githubLink: undefined,
    year: 2024
  },
  {
    title: "BidHub: Art market social platform",
    tags: ["Amazon S3", "C#", ".NET", "Docker", "SQL Server", "Entity framework", "React.js", "TypeScript", "Tailwind CSS"],
    shortDescription: "Platform connecting artists and collectors, empowering them to buy, sell, and celebrate art",
    description: "BidHub is an online platform that allows artists to easily showcase and sell their work, regardless of technical skill. The interface is designed to be intuitive and efficient, making it simple for both artists and collectors to connect. By following current trends in online art markets, the platform aims to provide a practical, accessible solution for presenting and discovering artwork in a digital environment.",
    collaborators: 5,
    highlights: [
      "Real-time auctions",
      "Adopted AWS and DigitalOcean, gaining hands-on experience with industry-standard cloud technologies.",
      "Integrated Amazon S3 for secure and scalable image storage.",
      "Conducted thorough backend testing to ensure reliability and code quality."
    ],
    year: 2023,
    githubLink: "https://github.com/SickerTeam/dom-aukcyjny",
    images: ["/images/projects/bidhub.png", "/images/projects/bidhub2.png", "/images/projects/bidhub3.png"]
  },
  {
    title: "Internal ticket management system",
    tags: ["Vue.js", ".NET", "C#", "SQL Server", "Tailwind CSS"],
    shortDescription: "Streamlining operations and enhancing team collaboration within an organization",
    description: "Collaboration on the development of an internal ticket management system, a critical tool for streamlining operations within an organization. This software helps with keeping track of requests and makes sure they get dealt with properly. A benefit of this system is that it helps everyone on the team collaborate more efficiently. It keeps all the tickets in a centralized location, so everyone within the organization can see what work currently needs to be done. For example, in a scenario where multiple departments are involved in resolving a complex issue, each team can view and contribute to the ticket's progress. The purpose of this project was also to make those things faster and make sure all employees can take responsibility.",
    collaborators: 2,
    highlights: [
      "Developed a dashboard with analytics and statistics on ticket trends for insights.",
      "Implemented a robust testing strategy to ensure application stability and reliability."
    ],
    year: 2023,
    githubLink: undefined,
    images: ["/images/projects/ticketsystem.png"]
  },
  {
    title: "getNoise: Music downloader",
    tags: ["Python", "Selenium", "Batch"],
    shortDescription: "Python script converts Spotify track links to high-quality M4A audio files",
    description: "This Python script allows users to convert any Spotify track link into a high-quality M4A audio file. By integrating the Spotify API, Selenium, and yt-dlp with FFmpeg, the script retrieves track details, searches YouTube for the corresponding audio, and downloads it in the desired format. Designed for efficiency and ease of use, this tool streamlines the process of obtaining audio files from Spotify links for offline listening or personal use.",
    collaborators: "Solo project",
    highlights: [
      "Converts Spotify tracks to high-quality M4A audio files",
      "Integrates Spotify API, Selenium, yt-dlp, and FFmpeg for seamless automation.",
      "Streamlines retrieval, search, and download with minimal user input.",
      "Designed for simplicity."
    ],
    year: 2023,
    githubLink: "https://github.com/DoubiOD/Spotify-link-to-.mp4-file",
    images: ["/images/projects/getnoise.png"]
  },
  {
    title: "WeDoLaundry: End-to-End laundry service",
    tags: ["C#", ".NET", "ADO.NET", "ASP.NET MVC", "SQL Server", "HTML", "CSS", "Javascript"],
    shortDescription: "Comprehensive laundry service solution with customer website, staff app, and courier system",
    description: "WeDoLaundry is a comprehensive laundry service solution designed to eliminate one of life's most time-consuming chores. This platform includes a customer-facing website and a staff management desktop application to create a seamless end-to-end service experience.",
    collaborators: 4,
    highlights: [
      "Intuitive scheduling system with real-time availability",
      "Automated notification system for order status updates",
      "Comprehensive admin dashboard for business analytics and operations management"
    ],
    year: 2022,
    githubLink: "https://github.com/4ndris1114/WeDoLaaundry",
    images: ["/images/projects/wedolaundry.png"]
  },
  {
    title: "Other professional projects",
    tags: ["Java", "Selenide", "Tomcat", "Python", "Flask", "InfluxDB", "Postgres", "Grafana", "Shell", "Docker", "Photoshop"],
    shortDescription: "Implementation of alerting system, data management tool, and backend for maritime service",
    description: "",
    collaborators: "1-3",
    highlights: [
      "Back-end for Maritime Messaging Service Edge Router in Java", 
      "An alerting system using Python, Grafana, and InfluxDB", 
      "Scheduled satellite telemetry download script utilizing Python", 
      "Integrated data management tool using Python",
      "Work on interactive visualization of satellite telemetry data",
      "Automated test project using Java and Selenide framework",
      "Software design prototypes utilizing Angular components and Adobe Photoshop"],
    year: "2021-2024",
    githubLink: undefined,
    images: ["/images/projects/sternula.png"]
  },
  {
    title: "University Enrollment Platform prototype",
    tags: ["Figma"],
    shortDescription: "Figma prototype to streamline enrollment for international and Erasmus students",
    description: "Figma prototypes developed to centralize and streamline enrollment for international and Erasmus students at Thomas More University. The solution replaces fragmented website information and inefficient email communication with a unified platform, allowing users to manage applications, buddy and landlord requests, bike rentals, and direct chat.",
    collaborators: 5,
    highlights: [
      "Demonstrated prototyping skills to quickly visualize and refine user flows",
      "Utilized UML diagrams to clearly communicate system structure and requirements.",
      "Thorough project analysis to ensure an efficient and user-centered solution."
    ],
    year: 2024,
    githubLink: undefined,
    images: ["/images/projects/skill1.png", "/images/projects/skill2.png", "/images/projects/skill3.png", "/images/projects/skill4.png", "/images/projects/skill5.png"]
  },
  {
    title: "Dormify: Housing management system",
    tags: ["Java", "Swing", "SQL Server"],
    shortDescription: "System to streamline inventory, tenant data, and paperwork for student housing",
    description: "Our team worked with UC House Aps in Aalborg, Denmark to identify and solve operational challenges. We developed a custom system that streamlines inventory, tenant data, and paperwork, making administrative tasks faster and more efficient for UC House.",
    collaborators: 3,
    highlights: [
      "Enabled faster, more organized completion of administrative tasks for UC House.",
      "Gained valuable experience in client communication, project scoping, and solution delivery."
    ],
    year: 2022,
    githubLink: "https://github.com/HiImDanix/ucn_2nd_semester",
    images: ["/images/projects/dormify.png"]
  },
  {
    title: ".SORT(): Logic Puzzle Game",
    shortDescription: "A logic-based puzzle game where players sort colored balls into columns, ensuring each column contains balls of only one color",
    description: "A logic-based puzzle game where players may move only the top ball from one column to another, placing it either onto a ball of the same color or into an empty column. The goal is to group all balls by color in separate columns, encouraging strategic and logical moves.",
    tags: ["Python"],
    collaborators: "Solo project",
    highlights: ["Developed exclusively in Python using the Tkinter library for graphical user interface and rendering."],
    images: ["/images/projects/sort.png"],
    githubLink: undefined,
    year: 2019
  },
  {
    title: "Game 15: Tile Sliding Puzzle",
    shortDescription: "Game 15 is a classic single-player logic game consisting of a 4x4 grid containing 15 numbered square tiles and one empty space",
    description: "The tiles are randomly scrambled at the start. The objective is to rearrange the tiles by sliding them one at a time into the empty space until the numbers are ordered sequentially from 1 to 15, left to right and top to bottom, with the empty space in the bottom-right corner",
    tags: ["Python"],
    collaborators: "Solo project",
    highlights: ["Developed exclusively in Python using the Tkinter library for graphical user interface and rendering."],
    images: ["/images/projects/game15.png", "/images/projects/game151.png", "/images/projects/game152.png", "/images/projects/game153.png", "/images/projects/game154.png"],
    githubLink: undefined,
    year: 2019
  }
];